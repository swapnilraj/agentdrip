## Second Opinion: Design Skill File Structure

### Format: Markdown, no contest

Use **Markdown**. JSON/YAML are tempting for structure but terrible for this use case — you need prose descriptions alongside code blocks, and Claude parses markdown natively. Structured data formats would force you to escape CSS, lose readability, and make the files painful to author. Markdown with consistent heading conventions gives you both human editability and machine parseability.

### Proposed Skill File Structure

```markdown
# Style: [Name]

## Identity
One paragraph capturing the *philosophy* — not "what it looks like" but *why it looks that way*. 
This is the most important section. Without it, output drifts generic.

## Constraints
Hard rules stated as imperatives. "Never use rounded corners." "Maximum 2 typefaces." 
These are more valuable than positive descriptions because they prevent Claude from 
falling back to defaults.

## Color Palette
Named tokens with hex values AND usage rules.
- `--bg`: #000 — always solid, never gradient
- `--accent`: #ff3300 — used sparingly, only for interactive elements

## Typography
Specific font stacks + fallbacks, scale ratios, weight rules.
Include a CSS snippet for the type system (~10-15 lines).

## Layout Patterns
2-3 CSS snippets showing characteristic layout structures.
Not full pages — just the distinctive grid/spacing patterns.

## Signature Moves
3-5 specific CSS techniques that make this style *this style*.
Each one: name, 3-line description, code snippet.
Example: "Overlapping elements with negative margins" for brutalist.

## Anti-patterns
What this style is NOT. "Do not add drop shadows." "Do not center everything."
This section does more work than you'd expect — it's the guardrail against 
Claude's tendency to make things "nice."

## Reference Snippet
One complete, minimal HTML+CSS example (~50-80 lines) showing a representative 
component (a card, a hero section, a nav). Not a full page — just enough to 
establish the voice.
```

### What Actually Produces Faithful Output

**Constraints > descriptions.** "Never use border-radius" is 10x more effective than "uses sharp edges." Claude defaults to safe, polished aesthetics. You need to explicitly forbid the defaults.

**Concrete CSS > prose about vibes.** "Use `letter-spacing: 0.3em; text-transform: uppercase;`" beats "typography feels spacious and authoritative." Give Claude code it can copy, not feelings it has to interpret.

**The anti-patterns section is non-negotiable.** Without it, brutalist will get subtle shadows, y2k will get tasteful restraint, and dark-luxury will get generic dark mode. You need to explicitly name what Claude will be tempted to do and tell it not to.

**One reference snippet, not three.** More examples = Claude averaging between them = generic output. One opinionated example forces a clear voice.

### Risks and Blind Spots

1. **Style bleed.** If Claude loads multiple skill files or has seen similar prompts, styles will contaminate each other. The `Identity` and `Anti-patterns` sections exist specifically to combat this — don't skip them.

2. **You'll over-specify color and under-specify spacing.** Every design system makes this mistake. Spacing, density, and whitespace ratios are what actually distinguish japanese-minimal from swiss-international. Encode spacing scales explicitly in `Layout Patterns`.

3. **"Retro-pixel" and "y2k" will be the hardest.** These depend on specific visual artifacts (pixel fonts, specific gradient styles, particular image treatments) that are hard to express in CSS alone. For these, lean heavier on the `Signature Moves` section with very concrete code.

4. **Font availability.** Your typography section will specify fonts the user doesn't have. Always include a websafe/system fallback stack and a Google Fonts import. Don't assume anything beyond system fonts.

5. **Responsive behavior.** Each style has different responsive expectations — brutalist might not care, editorial needs careful reflow. Add a 2-line note in `Layout Patterns` about responsive philosophy.

### What I'd Cut

Don't add: component libraries, full page templates, design token JSON exports, or "inspiration links." These add bulk without improving generation quality. Keep each skill file under 150 lines. Claude's faithfulness degrades with longer context — a tight, opinionated 100-line file will outperform a comprehensive 500-line one.
