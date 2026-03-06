# Design Skill File Format Specification

## Overview

A design skill file encodes enough visual DNA for an LLM to generate HTML pages faithful to a specific aesthetic. Each skill is a standalone Markdown file containing design philosophy, constraints, tokens, code patterns, and reference HTML.

## File Structure

Every skill file follows this exact section order:

```
# Design Skill: [Style Name]

## Philosophy
## The "No" List
## Design Tokens
### Colors
### Typography
### Spacing
## CSS Enforcers
## Signature Moves
## Responsive Behavior
## DO List
## Anti-patterns
## Reference Snippet
```

---

## Section Specifications

### 1. Philosophy (2-4 sentences)

The conceptual foundation. Name concrete inspirations (real products, movements, eras). Describe the *feeling*, not just the visuals. This primes the LLM's understanding before it sees any code.

**Good:** "Raw, honest, structural. The design exposes its own construction — it looks like a blueprint or database dump."
**Bad:** "A clean, modern design style."

### 2. The "No" List (8-12 items)

Hard constraints that prevent style drift. Each item starts with "NO" and names a specific CSS property, pattern, or visual choice to avoid.

**Rules for writing constraints:**
- Be specific enough to be machine-verifiable: "NO border-radius anywhere" not "NO rounded things"
- If a constraint has exceptions, state them inline: "NO rounded corners beyond 12px (exception: pill shapes use 100px)"
- Never contradict tokens or signature moves defined later in the file
- Scope constraints precisely: "NO monospace fonts for body text" not "NO monospace fonts" (if code blocks need them)

### 3. Design Tokens

#### Colors (5-8 tokens)
- Use CSS custom property names: `--bg`, `--fg`, `--accent`, etc.
- Provide hex values with descriptive labels: `--bg: #F7F5F0 (warm off-white, like handmade paper)`
- Each token gets exactly ONE value — no alternatives
- Include a usage ratio: "75% warm white, 15% text, 8% muted, 2% accent"

#### Typography (code block)
- Include the `@import url()` for Google Fonts
- Define body, h1, h2, h3 styles minimum
- Specify: font-family (with fallbacks), font-size, line-height, font-weight, letter-spacing
- All values must be consistent with the "No" list constraints

#### Spacing (4-6 bullet points)
- Define base unit (4px or 8px)
- Define max container width
- Define section spacing ranges
- Define padding conventions

### 4. CSS Enforcers (code block)

Global CSS resets and overrides that enforce the style. Applied via `*`, `body`, `a`, `::selection`, `img`. These are non-negotiable — every generated page must include them.

### 5. Signature Moves (3-5 patterns)

Named CSS patterns with descriptive headers and complete code blocks. These are the style's distinguishing visual techniques. Each must:
- Have a descriptive name (e.g., "Hard shadow card", "Neon glow text")
- Include complete, copy-pasteable CSS
- Use hardcoded values that match the Design Tokens (not custom properties, since generated pages inline everything)

### 6. Responsive Behavior (2-3 bullets)

How the design adapts to smaller screens. Specify:
- Grid collapse behavior and breakpoint
- Typography scaling on mobile
- Which visual elements are preserved vs. simplified

### 7. DO List (3-5 items)

Positive guidance for what the style MUST include. Each starts with "DO" and names a specific technique or element. These complement the "No" list by telling the LLM what to actively include, not just what to avoid.

**Good:** "DO use border-top as primary section separators"
**Bad:** "DO make it look nice"

### 8. Anti-patterns (4-6 items)

Prose descriptions of common mistakes. More nuanced than the "No" list — these describe *patterns* rather than properties. Start with "Do NOT".

### 9. Reference Snippet

A complete, standalone HTML file (with inline `<style>`) demonstrating the style applied to a realistic page. This is the single most important section — it serves as the primary example for generation.

**Requirements:**
- Must be a complete `<!DOCTYPE html>` document
- All CSS must be in a single `<style>` tag (no external stylesheets except Google Fonts @import)
- Must demonstrate at least 3 of the signature moves
- Must include realistic content (not lorem ipsum)
- Should be 80-150 lines of HTML
- Must pass all "No" list and anti-pattern checks

---

## Quality Checklist

Before finalizing a skill file, verify:

- [ ] No contradictions between "No" list, tokens, signature moves, and reference snippet
- [ ] All hex values in code blocks match the token definitions
- [ ] Font families in code blocks match the @import statement
- [ ] "No" list constraints have no exceptions that aren't explicitly stated
- [ ] Reference snippet uses at least 3 signature moves
- [ ] DO list items are specific and actionable
- [ ] Responsive behavior section covers grid collapse and typography scaling
- [ ] Each color token has exactly one value (no "X or Y")

---

## Available Skills

| # | Style | Key Differentiator |
|---|-------|-------------------|
| 01 | Brutalist | Raw monospace, exposed borders, inverted labels |
| 02 | Swiss International | 12-column grid, typographic hierarchy, red functional accent |
| 03 | Japanese Minimal | Warm whites, generous space (120px+), light weights, terracotta |
| 04 | Y2K | Starfield, neon glow, beveled windows, chrome gradients |
| 05 | Editorial | Magazine composition, kicker>headline>deck, mixed typefaces |
| 06 | Retro Pixel | 8-color palette, OS windows, pixel fonts, fixed 640px |
| 07 | Organic Soft | Pastel gradients, pill buttons, layered shadows, rounded everything |
| 08 | Neo-Brutalist | Bold colors, thick borders, hard offset shadows, playful |
| 09 | Dark Luxury | Near-black bg, indigo glow, ghost buttons, macro-spacing |
| 10 | Archival Research | Dense text, TOC sidebar, footnotes, scholarly blue links |

---

## Usage

To generate a page using a skill:

1. Read the skill file
2. Apply CSS Enforcers as the base
3. Use Design Tokens for all color/typography values
4. Incorporate at least 3 Signature Moves
5. Follow all DO List items
6. Check against the "No" list and Anti-patterns
7. Reference the snippet for structural guidance
8. Apply Responsive Behavior rules for mobile support
