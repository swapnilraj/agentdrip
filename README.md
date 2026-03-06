# AgentDrip

Design skill files that encode enough visual DNA for an LLM to generate faithful HTML pages in specific aesthetic styles.

**[Live Gallery](https://swapnilraj.github.io/agentdrip/)** - Browse all 30 generated pages across 10 styles.

## Styles

| # | Style | Vibe |
|---|-------|------|
| 01 | Brutalist | Raw monospace, exposed borders, inverted labels |
| 02 | Swiss International | 12-column grid, typographic hierarchy, red accent |
| 03 | Japanese Minimal | Warm whites, generous space, light weights |
| 04 | Y2K | Starfield, neon glow, beveled windows, chrome |
| 05 | Editorial | Magazine layout, mixed typefaces, kicker>headline>deck |
| 06 | Retro Pixel | 8-color palette, OS windows, pixel fonts |
| 07 | Organic Soft | Pastel gradients, pill buttons, layered shadows |
| 08 | Neo-Brutalist | Bold colors, thick borders, hard offset shadows |
| 09 | Dark Luxury | Near-black, indigo glow, ghost buttons |
| 10 | Archival Research | Dense text, TOC sidebar, footnotes, scholarly |

Each style has 3 test pages: **landing**, **portfolio**, and **blog**.

## Pipeline

Automated end-to-end workflow for generating new design skills:

```
corpus collection -> vision analysis -> skill generation -> page generation -> screenshot -> review -> refine -> validate
```

### Usage

```bash
# Set up API keys in .env
OPENROUTER_API_KEY=...
ARENA_ACCESS_TOKEN=...      # optional
UNSPLASH_ACCESS_KEY=...     # optional
SERPAPI_KEY=...              # optional

# Generate a new style
npx tsx pipeline.ts --style "art-deco" --urls "https://example.com"

# Resume after failure
npx tsx pipeline.ts --style "art-deco" --resume

# Skip collection, use existing corpus
npx tsx pipeline.ts --style "art-deco" --skip-collect --corpus corpus/art-deco/
```

### Pipeline Steps

1. **Collect** - Multi-source corpus (Are.na, Unsplash, SerpAPI, Playwright screenshots)
2. **Analyze** - Vision model extracts design patterns from corpus
3. **Generate Skill** - Creates skill markdown with validation retry loop (max 3 attempts)
4. **Generate Pages** - 3 HTML pages (landing, portfolio, blog) generated in parallel
5. **Screenshot** - Playwright renders and screenshots each page
6. **Review** - Multi-model review (Claude + Gemini via OpenRouter)
7. **Refine** - Apply feedback, regenerate skill + pages
8. **Validate** - Final spec compliance + visual consistency check

## Project Structure

```
skills/              # Design skill markdown files
test-pages/          # Generated HTML pages (deployed to GitHub Pages)
pipeline.ts          # CLI orchestrator
lib/
  types.ts           # TypeScript interfaces
  openrouter.ts      # OpenRouter API wrapper
  spec-validator.ts  # Skill format validator
steps/               # Pipeline step implementations
SKILL-FORMAT-SPEC.md # Skill file format specification
```

## Skill File Format

Each skill file contains 9 sections: Philosophy, "No" List, Design Tokens (Colors/Typography/Spacing), CSS Enforcers, Signature Moves, Responsive Behavior, DO List, Anti-patterns, and Reference Snippet. See [SKILL-FORMAT-SPEC.md](SKILL-FORMAT-SPEC.md) for the full specification.
