# skills.sh Research Report

Date: 2026-03-06

## What is skills.sh?

[skills.sh](https://skills.sh/) is an open directory for reusable AI agent capabilities, launched by Vercel in January 2026. Skills are Markdown files (SKILL.md) with YAML frontmatter that teach AI coding agents how to handle specific tasks. A single SKILL.md works across Claude Code, OpenAI Codex CLI, Gemini CLI, Cursor, GitHub Copilot, Windsurf, and 12+ other agents. As of early 2026, the platform tracks 86,000+ skills with 283,000+ total indexed.

Installation is via `npx skills add <owner/repo>`, which auto-detects installed agents and routes skill files to correct directories (e.g., `.claude/skills/`).

---

## Top 10 Frontend/Design Skills

Ranked by installs and relevance to our AgentDrip project:

| # | Skill | Author | Installs | Focus |
|---|-------|--------|----------|-------|
| 1 | [frontend-design](https://skills.sh/anthropics/skills/frontend-design) | Anthropic | 127.8K | Bold aesthetic direction, anti-generic-AI guidance |
| 2 | [web-design-guidelines](https://skills.sh/) | Vercel | 140.2K | UI compliance auditing against Web Interface Guidelines |
| 3 | [sleek-design-mobile-apps](https://skills.sh/) | sleekdotdesign | 61.3K | Mobile app design and styling |
| 4 | [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | nextlevelbuilder | N/A | 50+ styles, 97 palettes, 57 font pairings, 99 UX guidelines |
| 5 | [ui-ux-master](https://github.com/openclaw/skills/blob/main/skills/kdbhalala/ui-ux-master/SKILL.md) | kdbhalala | N/A | Cross-platform (web + Apple), WCAG, component standards |
| 6 | [ui-ux-design](https://github.com/openclaw/skills/blob/main/skills/itsjustdri/ui-ux-design/SKILL.md) | itsjustdri | N/A | shadcn/ui + Tailwind, mobile-first, micro-interactions |
| 7 | [Impeccable](https://impeccable.style/) | Community | N/A | 17 design commands (/polish, /audit, /distill, /bolder) |
| 8 | [tailwind-design-system](https://skills.sh/wshobson/agents/tailwind-design-system) | wshobson | N/A | Tailwind v4 design tokens, component variants, a11y |
| 9 | [canvas-design](https://skills.sh/anthropics/skills/canvas-design) | Anthropic | N/A | Single-page visual/poster/PDF output |
| 10 | [skill-creator](https://skills.sh/) | Anthropic | 65.0K | Meta-skill for building and evaluating new skills |

---

## Skill File Format and Structure

### Standard SKILL.md Format

```
skill-name/
  SKILL.md          (required, <500 lines)
  scripts/          (optional: executable code)
  references/       (optional: long-form docs)
  assets/           (optional: templates, icons)
```

SKILL.md structure:
- **YAML frontmatter**: `name`, `description`, `compatibility` (optional)
- **Markdown body**: Natural-language instructions

### Sections Found in Top Design Skills

The best frontend/design skills share these structural elements:

1. **Purpose / When to Activate** -- Trigger phrases or contexts (e.g., "when user asks to build a landing page")
2. **Design Philosophy** -- 2-6 paragraphs of conceptual direction
3. **Decision Framework** -- Steps to take before writing code (understand audience, pick aesthetic, identify constraints)
4. **Design Dimensions** -- Typography, Color, Motion, Spatial Composition, Visual Details (each with do/don't guidance)
5. **Anti-patterns** -- Specific things to avoid (generic fonts, cliched palettes)
6. **Accessibility Requirements** -- WCAG AA minimums, contrast ratios, keyboard nav, semantic HTML
7. **Component Standards** -- Buttons, forms, cards, navigation patterns with specific sizing
8. **Responsive Strategy** -- Breakpoints, mobile-first approach, layout adaptation patterns
9. **Motion/Animation Guidelines** -- Duration ranges, easing functions, prefers-reduced-motion
10. **Modern Design Trends** -- Dark mode, glassmorphism, neo-brutalism (contextual)
11. **Design Workflow** -- Step-by-step process (research > wireframe > visual > prototype > implement)
12. **Reference Materials** -- Code examples, inspiration sources, component libraries

### Key Format Differences from Our Spec

| Aspect | AgentDrip (Ours) | skills.sh Best Practice |
|--------|------------------|------------------------|
| Format | Custom 9-section Markdown | YAML frontmatter + free-form Markdown |
| Length | Unbounded (our snippets are long) | <500 lines recommended |
| Tokens | Hardcoded hex values | CSS custom properties + semantic naming |
| Scope | One visual style per file | Can span multiple styles or be style-agnostic |
| Trigger | Manual (read the skill file) | Auto-trigger via description matching |
| Resources | Everything inline | SKILL.md + separate reference/ and assets/ dirs |
| Accessibility | Not addressed | WCAG AA minimum is standard |
| Motion | Not addressed | Duration, easing, prefers-reduced-motion |
| Components | Not addressed | Button hierarchy, form patterns, card specs |
| Workflow | Not addressed | Multi-step decision framework before coding |

---

## Categories of Frontend Knowledge in Popular Skills

1. **Aesthetic Direction** -- Choosing and committing to a bold visual style
2. **Typography** -- Font pairing, type scales, distinctive vs. generic choices
3. **Color Systems** -- Semantic colors, oklch(), dark mode adaptation, palette ratios
4. **Layout & Composition** -- Grid systems, asymmetry, spatial hierarchy, 8px grid
5. **Accessibility** -- WCAG AA, contrast ratios, focus states, keyboard nav, aria attributes
6. **Responsive Design** -- Mobile-first, breakpoint strategies, layout reflow patterns
7. **Motion & Animation** -- Micro-interactions, page transitions, staggered reveals, reduced-motion
8. **Component Patterns** -- Button hierarchy, form design, card variants, navigation patterns
9. **Design Systems** -- Token management, CSS variables, consistent spacing scales
10. **Visual Effects** -- Glassmorphism, gradients, noise textures, shadows, grain overlays
11. **Platform Conventions** -- Web vs. iOS vs. Android design norms
12. **Performance** -- Sub-3s load, 60fps animations, GPU-accelerated transforms
13. **Design Workflow** -- Research > wireframe > visual design > prototype > implement

---

## How Best Skills Differ from "Design Tokens + Reference Code"

### 1. They Guide the Decision Process, Not Just the Output

The Anthropic frontend-design skill and ui-ux-master don't just provide tokens -- they walk the agent through a decision framework: understand purpose, pick aesthetic direction, consider constraints, identify what makes it memorable. Our skills skip straight to "here are the colors."

### 2. They Operate at the Right "Altitude"

Per Anthropic's own blog post on the topic: skills should prompt "at the right altitude, avoiding the two extremes of low-altitude hardcoded logic" and vague high-level guidance. Our skills are very low-altitude (exact hex values, exact CSS rules) which makes them faithful but inflexible.

### 3. They Include Accessibility as Non-Negotiable

Every top design skill includes WCAG AA minimums (4.5:1 contrast for text, 3:1 for large text), focus indicators, semantic HTML, keyboard navigation, and `prefers-reduced-motion` support. Our skills have zero accessibility guidance.

### 4. They Address Motion and Interaction

Top skills define animation duration ranges (100-200ms for micro-interactions, 400-600ms for transitions), easing functions (ease-out default, spring for playful), and explicitly require respecting `prefers-reduced-motion`. Our skills mention no motion at all.

### 5. They Include Component-Level Patterns

Best skills define button hierarchy (primary/secondary/ghost), form layout rules (single-column, labels above, inline validation), card specifications (border-radius ranges, padding, shadow layers), and navigation patterns (bottom tab bar for mobile, sidebar for desktop). Our skills only have page-level patterns.

### 6. They Use Progressive Disclosure

The recommended approach: SKILL.md stays under 500 lines with the core guidance, while detailed references live in separate files (references/, assets/). Our skills inline everything including 80-150 line HTML snippets.

### 7. They Explain Why, Not Just What

Top skills explain the reasoning behind constraints: "Avoid Inter because it signals generic AI output" vs. our approach of "NO Inter font." The LLM performs better when it understands the principle, not just the rule.

---

## Designer/UX Workflow Skills

Yes, several skills cover full design workflows:

### ui-ux-master (kdbhalala)
Includes a complete 5-step workflow:
1. Research & Discovery (user needs, competitive analysis, core flows)
2. Wireframing (ASCII sketches, low-fidelity layouts)
3. Visual Design (theme definition, component library creation)
4. Prototyping (interactive mockups, user testing)
5. Implementation (responsive dev, a11y testing, performance optimization)

Also includes a design checklist: visual hierarchy, consistency, feedback for interactions, accessibility compliance, performance (sub-3s load, 60fps), responsive, platform conventions.

### ui-ux-pro-max (nextlevelbuilder)
Uses a 4-step automated workflow:
1. Analyze Requirements (extract product type, style keywords, industry, tech stack)
2. Generate Design System (comprehensive palette, typography, spacing recommendations)
3. Supplement with Domain Searches
4. Apply Stack-Specific Guidelines (defaults to html-tailwind)

Includes 50+ pre-built styles, 97 color palettes, 57 font pairings as a reference database.

### Impeccable (community extension of Anthropic's frontend-design)
Adds 17 design commands that function as workflow steps:
- `/polish` -- Refine existing UI
- `/audit` -- Check design quality
- `/distill` -- Simplify complex designs
- `/bolder` -- Push aesthetic further

### Nathan Onn's approach (blog post)
Documented a workflow for turning any single design into a reusable skill:
1. Generate design variants with AI
2. Select and refine preferred design
3. Auto-generate comprehensive documentation (~1,900 lines of design tokens)
4. Package with skill-creator into SKILL.md + design-tokens.md + template.html
5. Install and apply across all future pages

---

## What AgentDrip Skills Are Missing

### Critical Gaps

1. **Accessibility section** -- No WCAG guidance, contrast ratios, focus states, keyboard nav, semantic HTML requirements, or prefers-reduced-motion
2. **Motion/Animation guidelines** -- No duration ranges, easing functions, interaction feedback, or scroll-triggered effects
3. **Component-level patterns** -- No button hierarchy, form rules, card specs, or navigation patterns specific to each style
4. **Decision framework** -- No guidance on when/how to apply the style, audience considerations, or adaptation principles
5. **YAML frontmatter** -- Not compatible with skills.sh ecosystem format
6. **Trigger context** -- No description of when the skill should activate

### Moderate Gaps

7. **Dark mode handling** -- No guidance on adapting styles for prefers-color-scheme
8. **Performance considerations** -- No guidance on animation performance, image optimization, font loading strategy
9. **Semantic HTML requirements** -- No guidance on heading hierarchy, landmark elements, or ARIA
10. **Progressive disclosure** -- Everything is inline; reference snippets should be separate files

### Minor Gaps

11. **Why explanations** -- Constraints are rules without reasoning
12. **Inspiration sources** -- Philosophy section could link to real-world examples more explicitly
13. **Design checklist** -- No machine-verifiable checklist for generated output

---

## Recommendations for Updating Our Skill Spec

### High Priority

1. **Add an Accessibility section** (after Responsive Behavior):
   - Minimum contrast ratios per WCAG AA
   - Required semantic HTML elements (nav, main, article, etc.)
   - Focus state requirements specific to the style
   - `prefers-reduced-motion` behavior
   - Touch target minimums (44x44px)

2. **Add a Motion & Interaction section** (after Signature Moves):
   - Animation durations appropriate to the style (e.g., brutalist = instant/0ms, organic soft = 300-500ms ease-out)
   - Hover/focus state definitions
   - Page load animation sequence
   - Scroll-triggered effects if any

3. **Add Component Patterns section** (after Signature Moves):
   - Button variants in this style (primary, secondary, ghost)
   - Card patterns
   - Navigation pattern
   - Form styling approach

4. **Add "Why" explanations to constraints** -- Change "NO border-radius" to "NO border-radius (raw edges expose structure, matching the blueprint aesthetic)"

### Medium Priority

5. **Add YAML frontmatter** for skills.sh compatibility:
   ```yaml
   ---
   name: brutalist-design
   description: Generate pages in raw brutalist style with monospace type, exposed borders, and structural honesty
   ---
   ```

6. **Extract reference snippets to separate files** -- Keep SKILL.md under 500 lines, move the HTML reference to `references/example.html`

7. **Add a Decision Framework** at the top: when to use this style, what audiences it suits, what it communicates

8. **Add dark mode guidance** per style -- how tokens adapt for `prefers-color-scheme: dark`

### Lower Priority

9. **Add font loading strategy** -- `font-display: swap` vs `optional`, preconnect hints
10. **Add a design checklist** -- machine-verifiable assertions for generated output quality
11. **Consider splitting into SKILL.md + design-tokens.md** for progressive disclosure
12. **Add inspiration sources** -- link to 3-5 real websites exemplifying each style

---

## Sources

- [skills.sh - The Agent Skills Directory](https://skills.sh/)
- [Anthropic frontend-design skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)
- [Anthropic skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Anthropic blog: Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills)
- [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)
- [ui-ux-master skill](https://github.com/openclaw/skills/blob/main/skills/kdbhalala/ui-ux-master/SKILL.md)
- [ui-ux-pro-max skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Impeccable - frontend-design extension](https://impeccable.style/)
- [Nathan Onn - Turning a design into a Claude Skill](https://www.nathanonn.com/claude-skill-design-system-reusable-frontend/)
- [skills.sh Review (vibecoding.app)](https://vibecoding.app/blog/skills-sh-review)
- [Agent Skills Guide (denser.ai)](https://denser.ai/blog/agent-skills-guide/)
- [awesome-agent-skills (GitHub)](https://github.com/skillmatic-ai/awesome-agent-skills)
