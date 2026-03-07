# Design Skill: Neo-Brutalist

## Philosophy
Brutalism's rebellious energy meets modern playfulness. Unlike classic brutalism (monochrome, raw), neo-brutalism is loud, colorful, and bold. Thick black borders, hard drop shadows, saturated background colors, and an intentionally "undesigned" feel. Inspired by Gumroad, Figma marketing pages, and the new wave of anti-corporate SaaS design. It says "we don't take ourselves too seriously" while still being functional.

## The "No" List
- NO subtle shadows (shadows are hard, offset, and visible — blurred shadows feel polished and corporate)
- NO gradients (flat color fills are bolder and more graphic — gradients soften the punch)
- NO thin borders (minimum 2px, prefer 3-4px — thin borders feel delicate and precious)
- NO muted or pastel colors as primary fills (pastels are too quiet — this style yells)
- NO elegant serif fonts (serifs feel editorial and refined, the opposite of playful rebellion)
- NO smooth rounded corners beyond 12px (exception: pill shapes like stickers and tags use 100px — large radii feel bubbly and soft, not chunky)
- NO transparency or glassmorphism (frosted glass is sleek and trendy, not raw and honest)
- NO dark mode — neo-brutalist is bright and loud (darkness adds sophistication this style rejects)
- NO uniform grid layouts — intentionally varied (perfect grids feel corporate and predictable)

## Design Tokens

### Colors
- `--bg`: #FFFDF7 (warm white)
- `--fg`: #1A1A1A (near-black)
- `--border`: #1A1A1A
- `--pink`: #FF6B9D
- `--yellow`: #FFE566
- `--blue`: #6BB5FF
- `--green`: #7BEA7B
- `--orange`: #FF9A56
- `--purple`: #C4A1FF
- Usage: white base, bold color fills on cards/sections, black borders everywhere

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');

body {
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}

h1, h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  line-height: 1.1;
}

h1 { font-size: 3.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.1rem; font-weight: 700; }

code, .mono {
  font-family: 'DM Mono', monospace;
}
```

### Spacing
- Base unit: 8px
- Generous padding in cards: 24-32px
- Section spacing: 64-96px
- Max container width: 1100px

## CSS Enforcers
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #FFFDF7;
  color: #1A1A1A;
}

a {
  color: #1A1A1A;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
```

## Signature Moves

### Hard shadow card
```css
.card {
  background: #FFFFFF;
  border: 3px solid #1A1A1A;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 6px 6px 0px 0px #1A1A1A;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px 0px #1A1A1A;
}
```

### Colored section fills
```css
.section-pink { background: #FF6B9D; }
.section-yellow { background: #FFE566; }
.section-blue { background: #6BB5FF; }
.section-green { background: #7BEA7B; }
```

### Thick-bordered button
```css
.btn {
  display: inline-block;
  padding: 12px 28px;
  background: #FFE566;
  color: #1A1A1A;
  border: 3px solid #1A1A1A;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
  transition: transform 0.1s, box-shadow 0.1s;
  text-decoration: none;
}

.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #1A1A1A;
}

.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #1A1A1A;
}
```

### Rotated/tilted accent
```css
.tilt {
  transform: rotate(-2deg);
}

.sticker {
  display: inline-block;
  background: #FF6B9D;
  border: 3px solid #1A1A1A;
  border-radius: 100px;
  padding: 8px 20px;
  font-weight: 700;
  transform: rotate(3deg);
}
```

## Motion & Interaction
- **Transitions:** 150-250ms ease on interactive elements — snappy and physical, like clicking a real button
- **Hover:** Cards shift with `translate(-2px, -2px)` and shadow grows from 5px to 7px; feels like lifting a sticker off paper
- **Focus:** 3px solid `#1A1A1A` outline with 2px offset on white backgrounds; on colored fills, use white outline instead
- **Page load:** No fancy entrance animations — content appears immediately, loud and confident. Optional: cards can pop in with a quick `scale(0.95→1)` at 150ms.
- **`prefers-reduced-motion`:** Disable translate shifts on hover; keep instant color changes on `:active` states

## Component Patterns
- **Buttons:** Primary uses `#FFE566` fill, `border: 3px solid #1A1A1A`, `border-radius: 8px`, `box-shadow: 4px 4px 0 #1A1A1A`, `font-weight: 700`. Secondary uses white fill with same border treatment. Ghost uses no fill, no shadow, just thick underline. Active state pushes down with `translate(2px, 2px)` and shadow shrinks.
- **Cards:** White or bold-color fill, `border: 3px solid #1A1A1A`, `border-radius: 8px-10px`, `padding: 24-28px`, hard offset `box-shadow: 5px 5px 0 #1A1A1A`. Each card in a set should use a different accent color.
- **Navigation:** Horizontal flex, brand in bold 700 uppercase-friendly, links with `text-decoration: none` and `font-weight: 500`. `border-bottom: 3px solid #1A1A1A` under the nav bar. Active link gets a colored background highlight.
- **Forms:** Inputs with `border: 3px solid #1A1A1A`, `border-radius: 8px`, `padding: 10px 14px`, white background. Focus adds `box-shadow: 3px 3px 0 #1A1A1A` and a colored border like `#6BB5FF`. Labels in `font-weight: 700` above inputs.

## Accessibility
- **Color contrast:** `--fg` (#1A1A1A) on `--bg` (#FFFDF7) = 17.8:1 (AAA). `--fg` on `--yellow` (#FFE566) = 9.1:1 (AAA). `--fg` on `--pink` (#FF6B9D) = 4.6:1 (AA). All color fills use dark text, never white.
- **Focus indicators:** 3px solid black outline with 2px offset — thick and unmissable, matching the border-heavy aesthetic
- **Semantic HTML:** Use `nav`, `main`, `section`, `footer` landmarks. Sticker/tag elements are `span` with `role` only when interactive.
- **Touch targets:** Minimum 44x44px; thick-bordered buttons with `padding: 12px 28px` exceed this naturally
- **`prefers-reduced-motion`:** Disable hover translate shifts and shadow transitions; keep `:active` press-down state as instant snap
- **Font sizing:** Body text at 16px minimum, headings scale large (3.5rem h1) for impact

## Responsive Behavior
- Stack card grids to single column below 640px
- Maintain thick borders and hard shadows at all sizes
- Colored section fills should remain full-width on mobile

## DO List
- DO use hard offset shadows (4-6px) on cards and buttons
- DO use thick borders (3px+) on all interactive and container elements
- DO use at least 3 different bold accent colors across the page
- DO make hover states feel physical (translate + shadow shift)
- DO use colored background fills on sections and cards

## Anti-patterns
- Do NOT use soft/blurred shadows — shadows must be hard offset
- Do NOT use neutral grey backgrounds
- Do NOT make it look "premium" or "luxury"
- Do NOT use thin 1px borders
- Do NOT use serif fonts
- Do NOT use monochrome palettes — at least 3 bold accent colors

## Differentiation from Classic Brutalist
Classic brutalist = monochrome, raw, monospace, exposed HTML structure.
Neo-brutalist = colorful, playful, thick borders, hard shadows, modern sans-serif. It shares the rejection of polish but adds personality and color.

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neo Brutal</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
    * { box-sizing: border-box; margin: 0; }
    body { font-family: 'Space Grotesk', sans-serif; background: #FFFDF7; color: #1A1A1A; font-size: 16px; line-height: 1.6; }
    a { color: #1A1A1A; text-decoration: underline; text-decoration-thickness: 2px; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 32px; }
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 3px solid #1A1A1A; }
    .nav-brand { font-weight: 700; font-size: 1.5rem; }
    .nav a { margin-left: 20px; text-decoration: none; font-weight: 500; }
    .hero { padding: 80px 0; }
    .hero h1 { font-size: 4rem; font-weight: 700; line-height: 1.05; max-width: 12ch; }
    .hero p { margin-top: 16px; max-width: 480px; font-size: 1.1rem; }
    .hero .btn { display: inline-block; margin-top: 32px; padding: 14px 32px; background: #FFE566; border: 3px solid #1A1A1A; border-radius: 8px; font-weight: 700; font-size: 1.1rem; text-decoration: none; box-shadow: 5px 5px 0 #1A1A1A; transition: transform 0.1s, box-shadow 0.1s; }
    .hero .btn:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #1A1A1A; }
    .hero .sticker { display: inline-block; background: #FF6B9D; border: 3px solid #1A1A1A; border-radius: 100px; padding: 6px 18px; font-weight: 700; font-size: 0.85rem; transform: rotate(3deg); margin-left: 16px; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 48px 0 96px; }
    .card { border: 3px solid #1A1A1A; border-radius: 10px; padding: 28px; box-shadow: 5px 5px 0 #1A1A1A; transition: transform 0.15s, box-shadow 0.15s; }
    .card:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #1A1A1A; }
    .card:nth-child(1) { background: #FFE566; }
    .card:nth-child(2) { background: #6BB5FF; }
    .card:nth-child(3) { background: #FF6B9D; }
    .card h3 { font-size: 1.3rem; margin-bottom: 8px; }
    .card p { font-size: 0.9rem; }
    .section-green { background: #7BEA7B; border-top: 3px solid #1A1A1A; border-bottom: 3px solid #1A1A1A; padding: 48px 0; text-align: center; }
    .section-green h2 { font-size: 2rem; }
    .footer { padding: 24px 0; border-top: 3px solid #1A1A1A; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <div class="nav-brand">NEOBR.</div>
      <div><a href="#">Products</a><a href="#">About</a><a href="#">Blog</a></div>
    </nav>
    <div class="hero">
      <h1>Build things that look fun</h1>
      <p>Design shouldn't be boring. Make it bold, make it colorful, make it unapologetically loud.</p>
      <a href="#" class="btn">Get Started</a>
      <span class="sticker">NEW!</span>
    </div>
    <div class="cards">
      <div class="card"><h3>Bold Colors</h3><p>Every surface is a chance to add energy and personality to your interface.</p></div>
      <div class="card"><h3>Hard Shadows</h3><p>No subtle depth tricks. Shadows are visible, offset, and proud.</p></div>
      <div class="card"><h3>Thick Borders</h3><p>Everything is outlined. The structure is visible and celebrated.</p></div>
    </div>
  </div>
  <div class="section-green">
    <div class="container">
      <h2>Ready to break the mold?</h2>
    </div>
  </div>
  <div class="container">
    <div class="footer">Made with bold intentions &mdash; 2026</div>
  </div>
</body>
</html>
```
