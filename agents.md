# Agents

## Pipeline Architecture

The design skill pipeline uses a linear step-based architecture with 3 automated retry loops. No agent framework - just TypeScript functions orchestrated by `pipeline.ts`.

### Step Flow

```
collect -> analyze -> generate-skill -> generate-pages -> screenshot -> review -> refine -> validate
```

### Retry Loops

**Loop 1: Skill Generation** (generate-skill + validate)
- After generating skill markdown, run spec validator
- If validation fails (missing sections, contradictions, bad tokens), feed errors back and regenerate
- Max 3 attempts

**Loop 2: Page Generation** (generate-pages + screenshot + vision check)
- After generating pages and screenshotting, send screenshots to vision model
- Check if pages match skill's design tokens and philosophy
- If mismatches, regenerate failing pages
- Max 2 attempts

**Loop 3: Review-Refine** (review + refine)
- Multi-model review (Claude Sonnet + Gemini via OpenRouter)
- Parse actionable issues, refine skill + pages if needed
- Max 2 iterations

### LLM Calls

All LLM calls go through OpenRouter (`lib/openrouter.ts`):
- **Text generation**: `chatCompletion()` - skill generation, page generation, refinement
- **Vision analysis**: `visionAnalysis()` - corpus analysis, visual consistency checks, review

Default model: `anthropic/claude-sonnet-4-6`. Review also uses `google/gemini-2.5-pro` for multi-perspective feedback.

### Corpus Collection Sources

| Source | API | Env Var | What it provides |
|--------|-----|---------|-----------------|
| Are.na | REST API | `ARENA_ACCESS_TOKEN` | Curated design inspiration blocks |
| Unsplash | REST API | `UNSPLASH_ACCESS_KEY` | High-quality mood/aesthetic photos |
| SerpAPI | REST API | `SERPAPI_KEY` | Google Images search results |
| User URLs | Playwright | n/a | Direct screenshots of reference sites |

All sources are optional - pipeline skips missing ones gracefully.

### State & Resumability

Pipeline state is serialized to `pipeline-state.json` after each step. Use `--resume` to pick up from the last failed step. State includes:
- Current/completed steps
- Analysis results
- Attempt counters for each retry loop
- Error log
