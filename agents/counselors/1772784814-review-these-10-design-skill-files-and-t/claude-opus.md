# Design Skill Review — Second Opinion

## Overview

I see 7 skill files (01-07) and only 1 test page (01-brutalist-landing.html) in the provided context. The prompt mentions 10 skills — skills 08-10 and test pages 02-07 are missing from the context. I'll review what's provided.

---

## 1. Brutalist — Skill + Test Page

### Faithfulness: **Strong (9/10)**
The test page nails it. Monospace body, Helvetica headings, black borders everywhere, inverted labels, exposed grid — textbook brutalist. The 6rem hero heading exceeds the spec's 4rem but that's actually better for the aesthetic.

### Token Compliance: **Good (8/10)**
- Colors correct: #000, #FFF, #0000FF
- Typography correct: Space Mono + Helvetica
- Spacing follows the "tight or wide" rule

### Issues:
- The `<br><br>` in the install block is sloppy HTML — use margin instead. Even brutalism shouldn't mean bad markup.
- The `.btn:hover` uses `#0000FF` background, consistent with the skill's link hover pattern — good.

---

## 2. Swiss International — Skill Only

### Skill Quality: **Excellent**
Most complete and coherent skill file. The 12-column grid, 8px base unit, asymmetric layouts, and functional-only color usage are all well-defined. The h3 definition has a duplicate `font-size` (declares `1.25rem` then `0.875rem`) — fix that.

### Concern:
- The "No" list says no centered text, but many real Swiss designs use centered asymmetry. This is a valid constraint but overly strict.

---

## 3. Japanese Minimal — Skill Only

### Skill Quality: **Very Good**
The warm palette (#F7F5F0, #2C2C2C, #B8564F) and generous spacing (120px+ sections) are spot-on for the aesthetic. The philosophy section is the strongest of all skills.

### Issues:
- **Font weight contradiction**: "No" list says no heavy weights (700+), but the reference snippet is fine since it stays at 400/600. However, the token definition imports `wght@0,600` for Noto Serif — make sure generated pages don't accidentally go to 700.
- The constraint "no more than 3 elements visible at once in any viewport" is vague and hard for an LLM to follow. Rephrase as layout density guidance.

---

## 4. Y2K Aesthetic — Skill Only

### Skill Quality: **Good with risks**
The most expressive skill. Chrome gradients, neon glows, beveled windows — it's all there.

### Issues:
- **"NO CSS grid" is counterproductive**. Saying "use tables" for era feel will produce inaccessible HTML. An LLM should use flexbox/grid but *style* it to look era-appropriate. Revise this constraint.
- The starfield SVG data URI is clever but will look tiny and repetitive. Consider providing a larger pattern.
- The `--bg` token gives two options (`#1A0A2E` or `#000000`) — pick one default. Ambiguity in tokens defeats the purpose.

---

## 5. Editorial — Skill Only

### Skill Quality: **Excellent**
The kicker > headline > deck > body hierarchy is the standout feature. Three font families (Playfair Display, Source Sans 3, Source Serif 4) is well-justified for editorial work.

### Issues:
- The `.feature-image { margin-left: -48px }` bleed effect will break on narrow viewports with no guard. Add a note about responsive behavior.
- "NO monospace fonts" is too absolute — editorial code snippets exist. Rephrase as "no monospace for body text."

---

## 6. Retro Pixel — Skill Only

### Skill Quality: **Good**
The 8-color palette constraint and pixel-perfect 8px grid are strong.

### Issues:
- **h3 at 12px with Press Start 2P is unreadable**. This font is already hard to read at small sizes. Minimum should be 14px.
- The "No" list says no font sizes below 16px, but the tokens define h3 at 12px. **Direct contradiction.**
- `-webkit-font-smoothing: none` only works on macOS/Safari. This is fine to include but should be noted as platform-dependent.

---

## 7. Organic Soft — Skill Only

### Skill Quality: **Very Good**
The pastel gradient system, layered shadows, and pill buttons create a cohesive system. The blob and glassmorphism signature moves are nice touches.

### Issues:
- The blob uses `filter: blur(40px)` + `position: absolute` — generated pages will need careful z-index management. The reference snippet handles this but the skill should explicitly warn about stacking context.
- `backdrop-filter` has limited support. Note this as progressive enhancement.

---

## Cross-Cutting Issues

### 1. Differentiation: **Strong overall**
Each style is genuinely distinct. Brutalist vs Japanese Minimal vs Y2K could not be confused. The weakest differentiation is Swiss International vs Editorial — both use light backgrounds, structured grids, and functional color. The Swiss skill should lean harder into its mathematical rigidity to separate from Editorial's expressive asymmetry.

### 2. Skill File Format — What's Missing

**Add a "Responsive Behavior" section.** None of the skills address what happens on mobile. This is a glaring omission — an LLM generating a page needs to know if the brutalist grid should stack, or if the Y2K page should stay fixed-width.

**Add a "Content Density" guidance.** How much content should a page section contain? The Japanese Minimal skill hints at this ("no more than 3 elements") but the others don't.

**Add explicit "DO" lists, not just "NO" lists.** The negative constraints are good for preventing mistakes, but an LLM also needs positive guidance. "DO use border-top as section separators" is more actionable than just "NO shadows."

**The Reference Snippet is the most valuable part.** Every skill should include one, and they all do — good. But consider adding a second variant (e.g., a blog post layout, not just a landing page) to give the LLM more range.

### 3. Token Consistency
Some skills define CSS custom properties (`--bg`, `--fg`) but never use them in the CSS Enforcers or Signature Moves (they hardcode hex values instead). Either commit to custom properties throughout or drop them — the inconsistency means generated code will likely hardcode values too.

### 4. Missing Test Pages
I can only evaluate 1 of the claimed test pages. The brutalist test page is excellent. Without seeing the others, I can't assess whether the skill files actually produce correct output across styles.

---

## Top 3 Actionable Recommendations

1. **Fix contradictions**: Y2K's dual `--bg` values, Retro Pixel's 12px h3 vs "no fonts below 16px", Swiss h3's duplicate font-size
2. **Add a Responsive section** to every skill file — even if it's just "stack to single column at 768px"
3. **Use CSS custom properties consistently** in all code blocks, not just the token definitions
