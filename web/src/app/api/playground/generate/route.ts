import { NextRequest, NextResponse } from "next/server";
import { findPackage } from "@/lib/find-style";
import { sanitizeGeneratedHtml } from "@/lib/html-sanitizer";

// --- In-memory rate limiting ---
interface RateEntry {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateEntry>();

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const HOURLY_LIMIT = 5;
const DAILY_LIMIT = 20;
const MAX_OUTPUT_BYTES = 50 * 1024; // 50KB
const MAX_PROMPT_LENGTH = 500;

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitMap.set(ip, entry);
  }

  // Prune old entries (older than 24h)
  entry.timestamps = entry.timestamps.filter((t) => now - t < DAY_MS);

  const hourAgo = now - HOUR_MS;
  const hourCount = entry.timestamps.filter((t) => t > hourAgo).length;
  if (hourCount >= HOURLY_LIMIT) {
    const oldest = entry.timestamps.filter((t) => t > hourAgo).sort((a, b) => a - b)[0];
    return { allowed: false, retryAfter: Math.ceil((oldest + HOUR_MS - now) / 1000) };
  }

  if (entry.timestamps.length >= DAILY_LIMIT) {
    const oldest = entry.timestamps.sort((a, b) => a - b)[0];
    return { allowed: false, retryAfter: Math.ceil((oldest + DAY_MS - now) / 1000) };
  }

  entry.timestamps.push(now);
  return { allowed: true };
}

function extractHtml(text: string): string {
  // Try to extract from ```html code blocks
  const match = text.match(/```html\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  // Try generic code block
  const generic = text.match(/```\s*([\s\S]*?)```/);
  if (generic) return generic[1].trim();
  return text.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, prompt } = body as { slug?: string; prompt?: string };

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: `prompt must be ${MAX_PROMPT_LENGTH} chars or less` }, { status: 400 });
    }

    // Rate limit
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
      );
    }

    // Look up skill
    const pkg = await findPackage(slug);
    if (!pkg || !pkg.skillContent) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const model = process.env.PLAYGROUND_MODEL || "anthropic/claude-sonnet-4";

    const systemPrompt = `You are a web designer. Generate a complete, standalone HTML page following this design style precisely.

## Design Skill
${pkg.skillContent}

## Rules
- Output ONLY a complete HTML document (<!DOCTYPE html> through </html>)
- Inline ALL CSS in a <style> tag
- Only external resource allowed: Google Fonts via @import
- Use placeholder images (solid color divs or inline SVG patterns)
- NO JavaScript whatsoever
- The page must be responsive
- Follow the design skill's philosophy, tokens, and patterns exactly
- Include at least 3 signature moves from the skill file`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://agentdrip.store",
        "X-Title": "AgentDrip Playground",
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter error:", response.status, errText);
      return NextResponse.json({ error: "LLM request failed" }, { status: 502 });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content ?? "";
    const tokensUsed = data.usage?.total_tokens ?? 0;

    let html = extractHtml(rawContent);
    html = sanitizeGeneratedHtml(html);

    // Enforce size limit
    if (new TextEncoder().encode(html).length > MAX_OUTPUT_BYTES) {
      return NextResponse.json({ error: "Generated output too large" }, { status: 413 });
    }

    return NextResponse.json({ html, model, tokensUsed });
  } catch (err) {
    console.error("Playground generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
