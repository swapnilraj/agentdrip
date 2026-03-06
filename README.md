# AgentDrip

Design skills for the AI era. Publish, browse, and use design style files that teach AI agents how to build beautiful pages.

**[Live Site](https://agentdrip.vercel.app)** | **[npm Packages](https://www.npmjs.com/org/agentdrip)**

## What is a Design Skill?

A design skill is a markdown file that encodes a visual style's DNA — philosophy, color tokens, typography, spacing, signature patterns, and a reference HTML snippet. Give it to an LLM and it can generate faithful pages in that style.

## Styles

| Style | Vibe | Package |
|-------|------|---------|
| Brutalist | Raw monospace, exposed borders, inverted labels | `@agentdrip/brutalist` |
| Swiss International | 12-column grid, typographic hierarchy, red accent | `@agentdrip/swiss-international` |
| Japanese Minimal | Warm whites, generous space, light weights | `@agentdrip/japanese-minimal` |
| Y2K Aesthetic | Starfield, neon glow, beveled windows, chrome | `@agentdrip/y2k-aesthetic` |
| Editorial | Magazine layout, mixed typefaces, kicker>headline>deck | `@agentdrip/editorial` |
| Retro Pixel | 8-color palette, OS windows, pixel fonts | `@agentdrip/retro-pixel` |
| Organic Soft | Pastel gradients, pill buttons, layered shadows | `@agentdrip/organic-soft` |
| Neo-Brutalist | Bold colors, thick borders, hard offset shadows | `@agentdrip/neo-brutalist` |
| Dark Luxury | Near-black, indigo glow, ghost buttons | `@agentdrip/dark-luxury` |
| Archival Research | Dense text, TOC sidebar, footnotes, scholarly | `@agentdrip/archival-research` |

## Using a Skill

```bash
# Install from npm
npm install @agentdrip/brutalist

# Read the skill file
cat node_modules/@agentdrip/brutalist/skill.md

# Get the CSS skin
cat node_modules/@agentdrip/brutalist/skin.css
```

Or use the CLI:

```bash
drip browse              # Browse available styles
drip get brutalist       # Get a skill file
drip wear brutalist      # Get CSS skin
```

## Publishing Your Own Skill

Anyone can publish a design skill to npm — no account on AgentDrip needed. The index discovers packages automatically via npm keywords.

### Package Structure

```
my-style/
  package.json        # keywords: ["agentdrip", "design-skill"]
  skill.md            # The design skill file
  skin.css            # CSS skin for live preview
  moodboard.json      # Inspiration images (optional)
  previews/
    landing.html      # Preview page
  README.md
```

### package.json

```json
{
  "name": "@yourscope/my-style",
  "keywords": ["agentdrip", "design-skill"],
  "agentdrip": {
    "type": "design-skill",
    "slug": "my-style",
    "displayName": "My Style",
    "tags": ["minimal", "dark"]
  }
}
```

The index syncs daily and will discover your package within 24 hours.

## Architecture

```
design-skill/
  packages/            # 10 @agentdrip npm packages
  web/                 # Next.js 16 app (agentdrip.vercel.app)
  cli/                 # CLI tool (drip browse/get/wear)
  skills/              # Original skill markdown files
  pipeline.ts          # Skill generation pipeline
```

### Key Features

- **npm as source of truth** — packages discovered via registry search
- **Live skin system** — CSS-only style swap via `data-drip-skin`
- **Playground** — LLM-powered HTML generation with any skill
- **Moodboard** — visual inspiration per style
- **Daily cron sync** — auto-indexes new packages

## Development

```bash
cd web && npm install && npm run dev     # Web app
cd cli && npx tsx src/index.ts browse    # CLI
```

## Skill Generation Pipeline

Automated workflow for creating new design skills from visual references:

```
corpus collection → vision analysis → skill generation → page generation → screenshot → review → refine
```

```bash
npx tsx pipeline.ts --style "art-deco" --urls "https://example.com"
```

## License

ISC
