# Design: Style Playground ("Try This Style")

## User Story

A user browsing styles wants to see how a style would look applied to *their* idea — not just a generic preview. They enter a prompt like "landing page for a coffee shop" and get a fully rendered HTML page in that style.

## Flow

1. User is on `/style/[slug]` detail page
2. Clicks "Try This Style" or sees a prompt input
3. Types: "landing page for an artisan coffee roaster"
4. Clicks "Generate"
5. Loading state (5-15 seconds)
6. Rendered HTML appears in a sandboxed iframe
7. User can tweak prompt and regenerate

## Architecture

### API: `POST /api/playground/generate`

**Request:**
```json
{
  "slug": "brutalist",
  "prompt": "landing page for an artisan coffee roaster"
}
```

**Response:**
```json
{
  "html": "<!DOCTYPE html>...",
  "model": "anthropic/claude-sonnet-4",
  "tokensUsed": 2400
}
```

**Server-side logic:**
1. Look up the skill file from DB (`packages.skillContent` by slug)
2. If no skill content, return 400
3. Build LLM prompt: skill file + user prompt (see Prompt Template below)
4. Call OpenRouter API (or Anthropic direct) with the prompt
5. Extract HTML from response
6. Return HTML string

### Prompt Template

```
You are a web designer. You have been given a design skill file that defines a visual style. Generate a complete, standalone HTML page that follows this style precisely.

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
- Include at least 3 signature moves from the skill file
```

### Security & Sandboxing

**Iframe sandbox (client-side):**
```html
<iframe
  sandbox="allow-same-origin"
  srcdoc={generatedHtml}
  referrerpolicy="no-referrer"
  csp="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data: https:"
/>
```

- `sandbox="allow-same-origin"` — needed for `srcdoc` CSS to work, but no `allow-scripts`, `allow-forms`, `allow-popups`, `allow-top-navigation`
- No JavaScript execution possible
- No form submissions
- No navigation/popups
- CSP blocks all external resources except Google Fonts
- `referrerpolicy="no-referrer"` prevents leaking page URL

**Server-side sanitization:**
- Strip all `<script>` tags from generated HTML before returning
- Strip all `on*` event handlers (onclick, onerror, onload, etc.)
- Strip `<iframe>`, `<embed>`, `<object>`, `<applet>` tags
- Strip `javascript:` URLs
- Strip `<form>` elements with external `action` attributes
- Strip `<meta http-equiv="refresh">` redirects
- Allow: `<style>`, `<link>` (Google Fonts only), `<img>` (data: and https: only), all semantic HTML

### Rate Limiting & Cost Control

**Per-IP rate limiting:**
- 5 generations per hour per IP
- 20 generations per day per IP
- Store in an in-memory Map (resets on cold start — acceptable for v1)
- Return 429 Too Many Requests with retry-after header

**Cost estimation:**
- ~2K input tokens (skill file) + ~500 tokens (prompt template) + ~2K output tokens
- At Claude Sonnet rates: ~$0.02 per generation
- 20/day/IP × 1000 unique IPs = 20K generations/day = $400/day worst case
- Realistic: 100-500 generations/day = $2-10/day

**LLM choice:**
- Use OpenRouter for flexibility (can switch models without code changes)
- Default model: `anthropic/claude-sonnet-4` (good balance of quality/cost)
- Fallback: `anthropic/claude-haiku-4` if budget is a concern
- API key: `OPENROUTER_API_KEY` env var

**Budget cap (optional v2):**
- Track daily spend in DB
- Hard cutoff at configurable daily limit
- Show "Playground is temporarily unavailable" when limit hit

### Client Component: `PlaygroundPanel`

Located on the style detail page.

```
[Text input: "Describe what you want to build..."]
[Generate button]

[Loading spinner / "Generating your page..."]

[Rendered preview in sandboxed iframe]
[Regenerate button]
```

**States:**
- `idle` — prompt input visible, no preview
- `generating` — loading spinner, input disabled
- `done` — iframe with preview, prompt still editable
- `error` — error message, retry button
- `rate-limited` — "You've reached the generation limit. Try again in X minutes."

### Files to Create/Modify

**New:**
- `web/src/app/api/playground/generate/route.ts` — POST endpoint
- `web/src/lib/html-sanitizer.ts` — server-side HTML sanitization
- `web/src/components/PlaygroundPanel.tsx` — client component

**Modify:**
- `web/src/app/style/[id]/StyleDetailClient.tsx` — add PlaygroundPanel

### Environment Variables

- `OPENROUTER_API_KEY` — required for playground to work
- `PLAYGROUND_MODEL` — optional, defaults to `anthropic/claude-sonnet-4`
- `PLAYGROUND_DAILY_LIMIT` — optional, max generations per day globally

## Open Questions for Counselors

1. Is `sandbox="allow-same-origin"` safe enough? Should we use a separate origin (e.g., render in a different subdomain)?
2. Is server-side HTML stripping sufficient, or do we need a proper HTML sanitization library (like DOMPurify server-side)?
3. Is in-memory rate limiting acceptable for v1, or should we use Vercel KV / Upstash Redis from the start?
4. Should we stream the LLM response for better UX, or wait for complete response then render?
5. Any attack vectors we're missing? (prompt injection to generate malicious HTML, resource exhaustion, etc.)
