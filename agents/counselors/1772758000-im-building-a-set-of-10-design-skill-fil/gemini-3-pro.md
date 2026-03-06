# Second Opinion: The "Design DNA" Skill File Architecture

You asked for a critical, independent opinion on structuring design skill files for 10 specific aesthetics.

**The Verdict:** You should use **Markdown (`.md`)** files.
**The Strategy:** Do not describe the style. **Enforce it.**

The biggest risk with LLM design generation is regression to the mean. If you ask for "Brutalist," the model will often give you a "slightly edgy Bootstrap." To get faithful output, your skill file must function less like a mood board and more like a **strict design system specification**.

Here is the optimal structure and approach.

---

### 1. Format: Why Markdown?
**Choose Markdown.**
*   **JSON/YAML** are too rigid. They require an interpreter logic (or the LLM to mentally parse a schema) which dilutes the "vibe."
*   **Markdown** allows you to mix *prose instructions* (which set the mental model) with *code blocks* (which provide the raw material). LLMs are optimized to read documentation and write code based on it. A Markdown skill file effectively becomes "documentation for a library that doesn't exist," which the LLM then implements on the fly.

### 2. The "Faithfulness" Formula
To avoid generic output, your skill file must contain **Opinionated Constraints**.
*   **Weak:** "Use bold typography."
*   **Strong:** "Headers must be `text-transform: uppercase`, `letter-spacing: -0.02em`, and `font-weight: 900`."
*   **Weak:** "Use bright colors."
*   **Strong:** "Use ONLY this hex palette. Do not use gradients. Do not use opacity."

### 3. Proposed Structure (The "Skill Schema")
Every skill file should follow this exact 6-part structure:

#### A. Metadata & Philosophy
A brief header setting the context.
*   **Description:** 2 sentences on the "vibe" (e.g., "Raw, unpolished, structural, ignoring conventional UX pleasantries").

#### B. The "No" List (Crucial for Faithfulness)
Start with negative constraints. This prevents the "Bootstrapification" of the design.
*   *Example (Brutalist):* "NO rounded corners. NO box-shadows. NO transparency. NO smooth transitions."

#### C. Design Tokens (The DNA)
Strict definitions for the core variables.
*   **Color Palette:** Limit to 3-5 specific Hex codes. Assign roles (Background, Text, Accent).
*   **Typography:** Define the exact font stack (system fonts are better than generic "sans-serif"), weights, and *essential* CSS properties (line-height, letter-spacing).
*   **Layout/Spacing:** Define the grid philosophy (e.g., "1px solid borders separating all elements").

#### D. CSS Enforcers (The Magic)
This is where you lock in the aesthetic. Provide a block of CSS that *must* be applied.
*   *Example (Y2K):* `* { image-rendering: pixelated; }` or specific scrollbar styling.
*   *Example (Swiss):* `.grid { display: grid; gap: 2rem; align-items: start; }`

#### E. Component Examples (The Blueprint)
Provide HTML/CSS snippets for 3 standard elements: **Button**, **Card/Container**, and **Hero Text**.
*   The LLM will mimic the *structure* of these snippets for all other elements.

#### F. One-Shot Example
A single, complete, very simple HTML structure representing the "Ideal State" of this style.

---

### 4. Concrete Example: `01-brutalist.md`

Here is exactly how I would write the Brutalist skill file. You can adapt this pattern for the other 9.

```markdown
# Design Skill: Neo-Brutalist / Utilitarian

## 1. Design Philosophy
Raw, honest, and structural. The design exposes its own construction. It prioritizes information density and raw HTML aesthetics over comfort. It feels like a database dump or a blueprint.

## 2. The "No" List (Strict Constraints)
- NO border-radius (everything must be square).
- NO box-shadows or subtle depth effects.
- NO opacity or transparency (unless for glitch effects).
- NO subtle greys for text (use absolute black #000000).
- NO gradients.

## 3. Design Tokens

### Colors
- **Background:** #FFFFFF (White) or #F0F0F0 (Light Grey)
- **Foreground:** #000000 (Pure Black)
- **Accent:** #0000FF (Hyperlink Blue) or #FF0000 (Alert Red)
- **Border:** 2px solid #000000

### Typography
- **Font Stack:** "Courier New", Courier, monospace (Primary); Helvetica, Arial, sans-serif (Headings only if necessary).
- **Scale:** H1 (4rem), H2 (2.5rem), Body (1rem).
- **Style:** All caps for headers. Normal for body.

## 4. CSS Enforcers
Apply these rules to the global stylesheet:

```css
:root {
  --border-width: 2px;
  --border-color: #000000;
  --spacing-unit: 1rem;
}

* {
  box-sizing: border-box;
  border-radius: 0 !important; /* Enforce squareness */
}

body {
  font-family: "Courier New", monospace;
  background-color: #FFFFFF;
  color: #000000;
  line-height: 1.4;
}

a {
  color: #0000FF;
  text-decoration: underline;
}

a:hover {
  background-color: #0000FF;
  color: #FFFFFF;
  text-decoration: none;
}

/* The "Grid Lines" look */
.container {
  border: var(--border-width) solid var(--border-color);
  padding: var(--spacing-unit);
  margin: var(--spacing-unit);
}
```

## 5. Component Patterns

### Primary Button
```css
.btn-brutal {
  appearance: none;
  background: white;
  color: black;
  border: 3px solid black;
  padding: 1rem 2rem;
  font-family: inherit;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px #000000; /* Hard shadow */
  transition: transform 0.1s;
}

.btn-brutal:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #000000;
}
```

### Content Card
```html
<div class="card" style="border: 2px solid black; padding: 1.5rem; outline: 1px solid black; outline-offset: -10px;">
  <h2 style="background: black; color: white; display: inline-block; padding: 0.5rem;">TITLE_HERE</h2>
  <p style="margin-top: 1rem; text-align: justify;">Content goes here.</p>
</div>
```

## 6. Layout Rules
- Use CSS Grid heavily.
- Elements should touch each other (borders collapsing) or have exaggerated distinct spacing.
- Use `<hr>` elements styled as `border-top: 2px solid black;` to separate sections.
```

### 5. Implementation Plan
1.  **Drafting:** Create the 10 `.md` files in `skills/`.
2.  **Scraping for Tokens:** Use your existing `collect.ts` images. Don't just look at them. Open them in an image editor to sample the *exact* hex codes and measure the *exact* border widths. The difference between `1px` and `3px` borders is the difference between "Minimal" and "Brutalist".
3.  **Prompting Claude:** When using these, your system prompt should be:
    > "You are a web design engine. Read the design skill file at `{path}`. Strictly adhere to its constraints, especially the 'No List'. Generate a single HTML file."

### Summary of Answers
1.  **Sections:** Metadata, Negative Constraints (The "No" List), Design Tokens, CSS Enforcers, Component Patterns, Layout Rules.
2.  **Format:** Markdown (`.md`).
3.  **Detail Level:** High detail for CSS (provide actual code), low detail for prose. Code is unambiguous; prose is open to interpretation.
4.  **Faithfulness:** Achieved by **negative constraints** (what *not* to do) and **hard-coded design tokens** (fonts/colors) rather than adjectives.
