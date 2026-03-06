# CLAUDE.md

## Project

AgentDrip — design skills for the AI era. A platform to publish, browse, and use design style files that teach AI agents how to build beautiful pages. npm is the source of truth; the website is a read-only index.

## Monorepo Structure

- `web/` — Next.js 16 app deployed to Vercel (agentdrip.vercel.app)
- `cli/` — CLI tool (`drip browse/get/wear`)
- `packages/` — 10 `@agentdrip/*` npm packages (skill + skin + preview + moodboard)
- `skills/` — Original skill markdown source files
- `pipeline.ts` — Skill generation pipeline (corpus → analysis → skill → pages)

## Tech Stack

### Web (`web/`)
- Next.js 16 with Turbopack, TypeScript, Tailwind CSS v4
- Drizzle ORM with Turso (libsql) for production, local SQLite for dev
- Server components + client components where needed
- PostCSS with `@tailwindcss/postcss`

### Pipeline (root)
- TypeScript, Node 20+, tsx runner
- OpenRouter API for LLM calls
- Playwright for screenshots

## Key Commands

```bash
# Web app
cd web
npm run dev              # Dev server
npm run build            # Production build
npm run db:seed          # Seed local DB
npm run sync             # Sync from npm registry

# Pipeline
npx tsx pipeline.ts --style "style-name"

# CLI
cd cli && npx tsx src/index.ts browse
```

## Web App Architecture

### npm Indexer (`web/src/lib/npm-indexer.ts`)
- Discovers packages via `registry.npmjs.org` search for keywords `agentdrip` + `design-skill`
- Fetches skill.md, skin.css, previews/landing.html, moodboard.json from unpkg CDN
- Upserts into `packages` table in Turso
- Triggered by daily Vercel cron (`/api/sync`) or manual POST

### Skin System
- Each style has a CSS skin stored in DB (`skinCss` column)
- `data-drip-skin` attribute on `<html>` activates a skin
- Server-side: cookie `drip-skin` read in layout.tsx, CSS injected in `<head>`
- Client-side: ThemeProvider manages wear/reset via localStorage + cookie
- Skin CSS uses `[data-drip-skin="slug"]` selectors with `!important` to override Tailwind
- `globals.css` has reset rules under `html[data-drip-skin]` for color inheritance

### Playground (`/api/playground/generate`)
- LLM generates HTML from skill file + user prompt
- Server-side sanitization via `sanitize-html` (strict allowlists)
- Sandboxed iframe rendering (`sandbox=""`, no scripts/forms/nav)
- Rate limited: 5/hour, 20/day per IP

### Database
- Single `packages` table (cache of npm data)
- Turso (libsql) in production, local SQLite file in dev
- Schema in `web/src/db/schema.ts`, Drizzle config in `web/drizzle.config.ts`

## npm Package Convention

Packages must have `keywords: ["agentdrip", "design-skill"]` and optionally an `agentdrip` field in package.json with metadata (slug, displayName, tags, colors, fonts, philosophy).

Required files: `skill.md`, `skin.css`, `previews/landing.html`
Optional: `moodboard.json`, `README.md`

## Environment Variables

### Web (production — Vercel)
- `TURSO_DATABASE_URL` — Turso libsql URL
- `TURSO_AUTH_TOKEN` — Turso auth token
- `OPENROUTER_API_KEY` — For playground LLM calls
- `CRON_SECRET` — Protects `/api/sync` GET endpoint

### Pipeline (root .env)
- `OPENROUTER_API_KEY` — For all LLM calls

## Code Conventions

- ES modules throughout (`"type": "module"`)
- `@/` path alias maps to `web/src/` in Next.js
- Server components by default, `"use client"` only when needed
- Tailwind v4 with `@import "tailwindcss"` in globals.css
- No unnecessary abstractions — keep components flat
- Skill files follow SKILL-FORMAT-SPEC.md: 9 sections in exact order

## Important Rules

- Each color token in a skill must have exactly ONE hex value
- "No" lists must never contradict tokens or signature moves
- Generated pages always inline all CSS (no external stylesheets except Google Fonts)
- Never commit `.env` files or API keys
- Use `printf` (not `echo`) when piping env vars to `vercel env add` to avoid trailing newlines
