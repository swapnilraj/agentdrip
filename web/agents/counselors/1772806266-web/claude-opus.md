I don't have write access in this environment, so here's the full implementation for the three new files and the modification to `StyleDetailClient.tsx`.

## New Files

### 1. `web/src/lib/html-sanitizer.ts`

```ts
/**
 * Server-side HTML sanitizer for LLM-generated pages.
 * Strips dangerous elements while preserving visual content.
 */
export function sanitizeHtml(html: string): string {
  let sanitized = html;

  // Strip <script> tags and contents
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, "");
  sanitized = sanitized.replace(/<script[^>]*\/>/gi, "");

  // Strip dangerous tags (iframe, embed, object, applet)
  for (const tag of ["iframe", "embed", "object", "applet"]) {
    sanitized = sanitized.replace(new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, "gi"), "");
    sanitized = sanitized.replace(new RegExp(`<${tag}[^>]*\\/?>`, "gi"), "");
  }

  // Strip on* event handlers
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // Strip javascript: URLs
  sanitized = sanitized.replace(/href\s*=\s*(?:"|')javascript:[^"']*(?:"|')/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*(?:"|')javascript:[^"']*(?:"|')/gi, 'src=""');

  // Strip <meta http-equiv="refresh">
  sanitized = sanitized.replace(/<meta[^>]*http-equiv\s*=\s*(?:"|')refresh(?:"|')[^>]*>/gi, "");

  // Strip <form> elements with external action
  sanitized = sanitized.replace(
    /<form[^>]*action\s*=\s*(?:"|')https?:\/\/[^"']*(?:"|')[^>]*>[\s\S]*?<\/form>/gi,
    ""
  );

  // Strip <link> tags that aren't Google Fonts
  sanitized = sanitized.replace(
    /<link[^>]*href\s*=\s*(?:"|')(?!https:\/\/fonts\.googleapis\.com)[^"']*(?:"|')[^>]*>/gi,
    ""
  );

  return sanitized;
}
```

### 2. `web/src/app/api/playground/generate/route.ts`

```ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sanitizeHtml } from "@/lib/html-sanitizer";

// In-memory rate limiting
const rateLimits = new Map<string, { hourly: number[]; daily: number[] }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const hourAgo = now - 3600_000;
  const dayAgo = now - 86400_000;

  let entry = rateLimits.get(ip);
  if (!entry) {
    entry = { hourly: [], daily: [] };
    rateLimits.set(ip, entry);
  }

  entry.hourly = entry.hourly.filter((t) => t > hourAgo);
  entry.daily = entry.daily.filter((t) => t > dayAgo);

  if (entry.hourly.length >= 5) {
    const oldest = entry.hourly[0];
    return { allowed: false, retryAfter: Math.ceil((oldest + 3600_000 - now) / 1000) };
  }
  if (entry.daily.length >= 20) {
    const oldest = entry.daily[0];
    return { allowed: false, retryAfter: Math.ceil((oldest + 86400_000 - now) / 1000) };
  }

  entry.hourly.push(now);
  entry.daily.push(now);
  return { allowed: true };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

const PROMPT_TEMPLATE = `You are a web designer. You have been given a design skill file that defines a visual style. Generate a complete, standalone HTML page that follows this style precisely.

## Design Skill
{skillContent}

## User Request
{userPrompt}

## Rules
- Output ONLY valid HTML — a complete document with <!DOCTYPE html>, <html>, <head>, <body>
- Inline ALL CSS in a <style> tag — no external stylesheets except Google Fonts @import
- Use only placeholder images (solid color divs, SVG patterns, or placeholder.com)
- No JavaScript
- No external resources except Google Fonts
- The page must be responsive
- Follow the design skill's philosophy, tokens, and patterns exactly
- Include at least 3 signature moves from the skill file`;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfter) },
        },
      );
    }

    const body = await req.json();
    const { slug, prompt: userPrompt } = body as { slug?: string; prompt?: string };

    if (!slug || !userPrompt || userPrompt.trim().length === 0) {
      return NextResponse.json({ error: "slug and prompt are required" }, { status: 400 });
    }

    if (userPrompt.length > 500) {
      return NextResponse.json({ error: "Prompt too long (max 500 characters)" }, { status: 400 });
    }

    const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));
    if (!pkg || !pkg.skillContent) {
      return NextResponse.json({ error: "Style not found or has no skill content" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Playground is not configured" }, { status: 503 });
    }

    const model = process.env.PLAYGROUND_MODEL || "anthropic/claude-sonnet-4";
    const llmPrompt = PROMPT_TEMPLATE
      .replace("{skillContent}", pkg.skillContent)
      .replace("{userPrompt}", userPrompt);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://agentdrip.com",
        "X-Title": "AgentDrip Playground",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: llmPrompt }],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter error:", response.status, await response.text());
      return NextResponse.json({ error: "LLM generation failed" }, { status: 502 });
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    const tokensUsed: number = data.usage?.total_tokens ?? 0;

    // Extract HTML (may be wrapped in markdown code blocks)
    let html = content;
    const htmlMatch = content.match(/```html\s*([\s\S]*?)```/);
    if (htmlMatch) {
      html = htmlMatch[1];
    } else {
      const genericMatch = content.match(/```\s*(<!DOCTYPE[\s\S]*?)```/i);
      if (genericMatch) html = genericMatch[1];
    }

    html = sanitizeHtml(html.trim());

    return NextResponse.json({ html, model, tokensUsed });
  } catch (error) {
    console.error("Playground generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### 3. `web/src/components/PlaygroundPanel.tsx`

```tsx
"use client";

import { useState } from "react";

type State = "idle" | "generating" | "done" | "error" | "rate-limited";

export function PlaygroundPanel({ slug }: { slug: string }) {
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<State>("idle");
  const [html, setHtml] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setState("generating");
    setErrorMessage("");

    try {
      const res = await fetch("/api/playground/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, prompt: prompt.trim() }),
      });

      if (res.status === 429) {
        const retry = parseInt(res.headers.get("Retry-After") || "60", 10);
        setRetryAfter(Math.ceil(retry / 60));
        setState("rate-limited");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || "Generation failed");
        setState("error");
        return;
      }

      const data = await res.json();
      setHtml(data.html);
      setState("done");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setState("error");
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Try This Style</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && state !== "generating" && handleGenerate()}
          placeholder="Describe what you want to build..."
          maxLength={500}
          disabled={state === "generating"}
          className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-sm placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
        />
        <button
          onClick={handleGenerate}
          disabled={state === "generating" || !prompt.trim()}
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white text-sm font-medium transition-colors"
        >
          {state === "generating" ? "Generating…" : state === "done" ? "Regenerate" : "Generate"}
        </button>
      </div>

      {state === "generating" && (
        <div className="mt-6 flex items-center gap-3 text-neutral-400 text-sm">
          <div className="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Generating your page…
        </div>
      )}

      {state === "error" && (
        <div className="mt-4 text-red-400 text-sm">
          {errorMessage}
          <button onClick={handleGenerate} className="ml-3 underline hover:text-red-300">
            Retry
          </button>
        </div>
      )}

      {state === "rate-limited" && (
        <div className="mt-4 text-amber-400 text-sm">
          You've reached the generation limit. Try again in {retryAfter} minute{retryAfter !== 1 ? "s" : ""}.
        </div>
      )}

      {state === "done" && html && (
        <div className="mt-6 rounded-xl border border-neutral-800 overflow-hidden bg-white">
          <iframe
            sandbox="allow-same-origin"
            srcDoc={html}
            referrerPolicy="no-referrer"
            className="w-full h-[600px]"
            style={{ border: "none" }}
          />
        </div>
      )}
    </div>
  );
}
```

### 4. Modify `web/src/app/style/[id]/StyleDetailClient.tsx`

Add the import at the top and the `<PlaygroundPanel>` at the bottom of the component:

**Add import (line 3):**
```ts
import { PlaygroundPanel } from "@/components/PlaygroundPanel";
```

**Add before the closing `</div>` on line 127:**
```tsx
      <PlaygroundPanel slug={style.slug} />
```

---

### Environment variables to add to `.env`:

```
PLAYGROUND_MODEL=anthropic/claude-sonnet-4
```

(`OPENROUTER_API_KEY` already exists in `.env.example`)

---

**Summary of what this implements:**
- **HTML sanitizer** — strips scripts, event handlers, dangerous tags, javascript: URLs, non-Google-Fonts links, meta refresh, external forms
- **POST `/api/playground/generate`** — looks up skill content, calls OpenRouter, extracts/sanitizes HTML, returns it. In-memory rate limiting (5/hour, 20/day per IP)
- **`PlaygroundPanel`** — client component with prompt input, loading/error/rate-limited states, sandboxed iframe preview
- **Integration** — added to the style detail page below the preview/skill tabs
