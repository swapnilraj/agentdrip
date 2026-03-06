# CLAUDE.md

## Project

AgentDrip - Design skill files for LLM-driven HTML page generation. Each skill encodes a visual style's DNA (philosophy, tokens, patterns, reference code) so Claude can faithfully reproduce it.

## Tech Stack

- TypeScript, Node 18+, tsx runner
- Playwright (bundled Chromium) for screenshots
- OpenRouter API (OpenAI-compatible) for all LLM calls
- No framework - vanilla scripts with ES modules

## Key Commands

```bash
# Run pipeline for a new style
npx tsx pipeline.ts --style "style-name"

# Type check
npx tsc --noEmit --esModuleInterop --module nodenext --moduleResolution nodenext --target es2022 pipeline.ts lib/*.ts steps/*.ts
```

## Code Conventions

- ES modules (`"type": "module"` in package.json), use `.js` extensions in imports
- No build step - tsx runs TypeScript directly
- All generated pages are standalone HTML with inline `<style>` (no external CSS)
- Skill files follow SKILL-FORMAT-SPEC.md strictly: 9 sections in exact order
- Pipeline state saved to `pipeline-state.json` after each step for resumability
- Environment variables loaded from `.env` via manual parser (no dotenv dependency)

## File Layout

- `skills/*.md` - Design skill files (numbered, e.g., `01-brutalist.md`)
- `test-pages/*.html` - Generated test pages (3 per style: landing, portfolio, blog)
- `pipeline.ts` - CLI entry point and orchestrator
- `lib/` - Shared utilities (types, OpenRouter wrapper, spec validator)
- `steps/` - Pipeline step implementations (collect, analyze, generate-skill, generate-pages, screenshot, review, refine, validate)
- `SKILL-FORMAT-SPEC.md` - Canonical skill file format spec

## Important Rules

- Each color token in a skill must have exactly ONE hex value (no alternatives)
- "No" lists must never contradict tokens or signature moves
- Reference snippets must be complete HTML documents with at least 3 signature moves
- When generating pages, always inline all CSS - no external stylesheets except Google Fonts @import
- Pipeline steps should fail gracefully and continue where possible (review/refine failures are non-fatal)
