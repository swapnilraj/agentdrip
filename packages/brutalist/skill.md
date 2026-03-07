# Design Skill: Brutalist

## Philosophy
Raw, honest, structural. The design exposes its own construction — it looks like a blueprint or database dump. It rejects polish, smoothness, and conventional UX pleasantries. Content is the interface. The aesthetic comes from the absence of aesthetic.

## The "No" List
- NO border-radius anywhere (raw edges expose structural honesty)
- NO box-shadows or depth effects (flatness enforces rawness)
- NO gradients (gradients imply smoothness and refinement)
- NO opacity or transparency (everything is fully opaque and confrontational)
- NO smooth transitions or animations (instant state changes reflect mechanical honesty)
- NO subtle greys — use pure black #000 and pure white #FFF (ambiguity is weakness)
- NO centered hero layouts with large padding (reject conventional marketing comfort)
- NO stock photography or decorative imagery (content is the only visual)
- NO more than 2 typefaces (constraint is the point)
- NO comfortable whitespace — either cramped or deliberately vast (medium spacing is mediocrity)

## Design Tokens

### Colors
- `--bg`: #FFFFFF
- `--fg`: #000000
- `--accent`: #0000FF (hyperlink blue)
- `--alert`: #FF0000
- `--border`: #000000
- Usage: 60% white, 35% black, 5% accent

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

body {
  font-family: 'Space Mono', 'Courier New', Courier, monospace;
  font-size: 16px;
  line-height: 1.4;
}

h1, h2, h3 {
  font-family: Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 900;
}

h1 { font-size: 4rem; }
h2 { font-size: 2.5rem; }
h3 { font-size: 1.5rem; }
```

### Spacing
- Base unit: 1rem
- Containers use 1rem padding
- Elements either touch (borders collapse) or have exaggerated 4rem+ gaps
- No medium spacing — everything is tight or wide

## CSS Enforcers
```css
:root {
  --border: 2px solid #000;
}

* {
  box-sizing: border-box;
  border-radius: 0 !important;
}

body {
  margin: 0;
  background: #FFF;
  color: #000;
}

a {
  color: #0000FF;
  text-decoration: underline;
}

a:hover {
  background: #0000FF;
  color: #FFF;
  text-decoration: none;
}

hr {
  border: none;
  border-top: 2px solid #000;
  margin: 2rem 0;
}
```

## Signature Moves

### Hard-edge containers
```css
.container {
  border: 2px solid #000;
  padding: 1rem;
  margin: 1rem 0;
}
```

### Inverted text blocks
```css
.inverted {
  background: #000;
  color: #FFF;
  display: inline-block;
  padding: 0.25rem 0.5rem;
}
```

### Exposed grid with visible borders
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  border: 2px solid #000;
}

.grid > * {
  border: 1px solid #000;
  padding: 1rem;
}
```

## Motion & Interaction
- **Transition duration**: 0ms. No easing, no animation. State changes are instant — hover on, hover off, done.
- **Hover states**: Invert colors immediately. Link becomes `background: #0000FF; color: #FFF`. No fade, no slide.
- **Focus states**: 2px solid #000 outline with 2px offset. On dark backgrounds, 2px solid #FFF. No glow, no ring.
- **Page load**: Immediate render. No fade-in, no staggered entrance. The page appears like a light switch.
- **`prefers-reduced-motion`**: No changes needed — there is no motion to reduce.

## Component Patterns
- **Buttons**: `border: 2px solid #000; background: #FFF; color: #000; padding: 0.5rem 1rem; font-family: 'Space Mono', monospace; text-transform: uppercase; cursor: pointer`. Primary: inverted (`background: #000; color: #FFF`). Ghost: border only. Hover: invert all variants instantly.
- **Cards**: `border: 2px solid #000; padding: 1rem; background: #FFF`. No shadow, no radius. Title uses inverted text block (`.inverted` signature move). Cards touch each other or use 1rem gap — nothing in between.
- **Navigation**: Horizontal, slash-separated links (`/`). All links visible, no hamburger ever. Active state: inverted text block. `font-size: 0.875rem; text-transform: uppercase`.
- **Forms**: `border: 2px solid #000; padding: 0.5rem; font-family: 'Space Mono', monospace; background: #FFF`. Labels above inputs, uppercase, 0.75rem. No placeholder text — use visible labels. Focus: 2px solid #0000FF outline.

## Accessibility
- **Color contrast**: #000 on #FFF is 21:1 (exceeds WCAG AAA). #0000FF on #FFF is 8.6:1 (passes AA). Inverted #FFF on #000 is 21:1.
- **Focus indicators**: 2px solid outline with 2px offset — always visible, never obscured. Meets 3:1 contrast requirement.
- **Semantic HTML**: Use `<nav>`, `<main>`, `<article>`, `<footer>`. Structure is the aesthetic — semantic tags reinforce it.
- **Touch targets**: All buttons and links minimum 44x44px hit area. Pad small links with extra padding if needed.
- **`prefers-reduced-motion`**: No motion exists to disable (cross-ref Motion section).
- **Font sizing**: Body text 16px minimum. Monospace at smaller sizes is harder to read — never go below 14px for any text.

## Responsive Behavior
- Stack grid columns to single column below 600px
- Maintain all border and structural elements at every breakpoint
- No responsive hamburger menus — show all nav links or stack them vertically

## DO List
- DO use border-top and border-bottom as primary section separators
- DO expose the HTML structure visually — grids, borders, labels
- DO use monospace for body text and sans-serif for headings
- DO make hover states instant and high-contrast (inverted colors)
- DO use `--alert` (#FF0000) for at least one element per page (e.g., a status label or warning)

## Anti-patterns
- Do NOT add subtle shadows to "lift" elements
- Do NOT use system-ui or rounded sans-serif fonts
- Do NOT add hover transitions longer than 0.1s
- Do NOT use padding larger than 2rem on body
- Do NOT make it "nice" — if it looks comfortable, you've failed

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BRUTALIST PAGE</title>
  <style>
    * { box-sizing: border-box; border-radius: 0 !important; margin: 0; }
    body { font-family: 'Courier New', monospace; background: #FFF; color: #000; }
    a { color: #0000FF; } a:hover { background: #0000FF; color: #FFF; }
    .header { border-bottom: 3px solid #000; padding: 1rem; display: flex; justify-content: space-between; }
    .header h1 { font-family: Helvetica, sans-serif; font-size: 1.5rem; text-transform: uppercase; }
    .hero { padding: 2rem 1rem; border-bottom: 2px solid #000; }
    .hero h2 { font-family: Helvetica, sans-serif; font-size: 5rem; text-transform: uppercase; line-height: 0.95; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }
    .grid > div { border: 1px solid #000; padding: 1rem; }
    .grid h3 { background: #000; color: #FFF; display: inline-block; padding: 0.25rem 0.5rem; font-family: Helvetica, sans-serif; text-transform: uppercase; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .footer { border-top: 3px solid #000; padding: 1rem; font-size: 0.75rem; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Site Title</h1>
    <nav><a href="#">About</a> / <a href="#">Work</a> / <a href="#">Contact</a></nav>
  </div>
  <div class="hero">
    <h2>Raw content.<br>No decoration.</h2>
  </div>
  <div class="grid">
    <div><h3>Section 01</h3><p>Content block with monospaced text and hard borders.</p></div>
    <div><h3>Section 02</h3><p>Everything is visible. The structure is the design.</p></div>
    <div><h3>Section 03</h3><p>No hiding behind gradients or shadows.</p></div>
  </div>
  <div class="footer">Built with HTML. Nothing else needed.</div>
</body>
</html>
```
