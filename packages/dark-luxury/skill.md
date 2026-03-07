# Design Skill: Dark Luxury

## Philosophy
Premium, restrained, and atmospheric. Inspired by Linear, Vercel, Stripe, and high-end product marketing. The dark background isn't just dark mode — it's a deliberate stage for content to glow against. Every element feels engineered and precise. Typography is clean and confident. Color is used surgically — a single accent that says "expensive." The design whispers authority rather than shouting it.

## The "No" List
- NO pure white text on pure black (harsh contrast fatigues the eye and breaks the atmospheric mood)
- NO saturated colors as backgrounds (competes with the accent glow and cheapens the palette)
- NO playful fonts or rounded typefaces (undermines the engineered, precise tone)
- NO visible borders heavier than 1px (thick borders feel structural, not premium)
- NO hard shadows (depth comes from glow and subtle borders, not drop shadows)
- NO decorative elements, patterns, or textures (luxury = restraint, not ornamentation)
- NO more than 1 accent color family (multiple accents dilute the surgical color strategy; indigo-to-purple gradient counts as one)
- NO large blocks of body text without a clear hierarchy (dense text without hierarchy feels like documentation, not product)
- NO traditional "card" layouts with obvious outlines (cards should dissolve into the dark, not frame themselves)
- NO emoji or icons that feel casual (breaks the whispered authority of the aesthetic)

## Design Tokens

### Colors
- `--bg`: #09090B (near-black)
- `--bg-elevated`: #18181B (dark surface)
- `--fg`: #FAFAFA (off-white)
- `--muted`: #71717A (zinc-500)
- `--accent`: #6366F1 (indigo, used sparingly)
- `--border`: rgba(255, 255, 255, 0.08)
- `--glow`: rgba(99, 102, 241, 0.15)
- Usage: 85% dark, 10% muted text, 5% accent glow

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

body {
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 400;
  color: #FAFAFA;
  -webkit-font-smoothing: antialiased;
}

h1 {
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h3 {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #71717A;
}
```

### Spacing
- Base unit: 4px
- Tight micro-spacing between related elements
- Large macro-spacing between sections (120-200px)
- Max container: 1200px
- Content often narrow: 680px for text blocks

## CSS Enforcers
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #09090B;
  color: #FAFAFA;
}

a {
  color: #FAFAFA;
  text-decoration: none;
}

::selection {
  background: #6366F1;
  color: #FFF;
}

img {
  display: block;
  max-width: 100%;
}
```

## Signature Moves

### Subtle border card
```css
.card {
  background: #18181B;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 28px;
}
```

### Accent glow
```css
.glow-accent {
  box-shadow: 0 0 60px rgba(99, 102, 241, 0.15);
}

.glow-text {
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Gradient mesh background
```css
.gradient-bg {
  position: relative;
}

.gradient-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
  pointer-events: none;
}
```

### Ghost button
```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #FAFAFA;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.25);
}
```

### Fade-in section divider
```css
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  margin: 0;
  border: none;
}
```

## Motion & Interaction
- **Transition duration range:** 400–700ms ease-out — slow, cinematic, deliberate
- **Hover states:** ghost buttons brighten border opacity; cards gain a faint glow (`box-shadow: 0 0 40px rgba(99,102,241,0.08)`); links fade from muted to off-white
- **Focus states:** 2px solid #6366F1 outline with 2px offset on dark backgrounds — visible but refined
- **Page load:** staggered fade-in (opacity 0→1, translateY(12px→0)) with 400ms base + 150ms delay per element
- **`prefers-reduced-motion`:** disable all transforms and staggered delays; keep opacity transitions at 200ms

## Component Patterns
- **Buttons:** primary — `background: #FAFAFA; color: #09090B; border-radius: 8px; padding: 12px 28px; font-weight: 500; transition: opacity 0.4s`. Secondary (ghost) — transparent bg, `border: 1px solid rgba(255,255,255,0.15)`, hover brightens border. No tertiary/text variant — too casual.
- **Cards:** `background: #18181B; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px`. No visible shadow. Hover adds faint glow. Content uses h3 (uppercase label) → h2 → muted paragraph.
- **Navigation:** horizontal flex, brand left, links right. Links in `#71717A` at 0.85rem, hover → `#FAFAFA` over 400ms. No underlines, no active indicators beyond color.
- **Forms:** inputs use `background: #18181B; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; color: #FAFAFA`. Focus border brightens to `rgba(255,255,255,0.25)`. Labels are uppercase muted text above the field.

## Accessibility
- **Color contrast:** `--fg` (#FAFAFA) on `--bg` (#09090B) = 19.3:1 ✓. `--muted` (#71717A) on `--bg` (#09090B) = 4.8:1 ✓ (AA). Accent (#6366F1) on dark bg = 4.6:1 ✓ for large text only — use off-white for small accent-labeled text.
- **Focus indicators:** 2px solid #6366F1, 2px offset — meets 3:1 against #09090B (4.6:1)
- **Semantic HTML:** require `<nav>`, `<main>`, `<article>`, `<footer>` landmarks
- **Touch targets:** ghost buttons and nav links minimum 44px tall (padding ensures this)
- **`prefers-reduced-motion`:** disable staggered fade-ins and translateY transforms; retain opacity
- **Font sizing:** 15px base (body), headings in rem; avoid anything below 12px

## Responsive Behavior
- Collapse feature grids to single column below 768px
- Maintain dark background and subtle border treatments at all sizes
- Reduce hero h1 from 4rem to 2.5rem on mobile

## DO List
- DO use the radial gradient glow behind hero sections
- DO use ghost buttons (transparent bg, subtle border) as secondary CTAs
- DO use the gradient fade divider between sections
- DO use uppercase small-text labels (0.7-0.8rem, letter-spacing 0.1em+) for categories
- DO use large macro-spacing (120px+) between major sections

## Anti-patterns
- Do NOT use bright white (#FFF) for backgrounds or large surfaces
- Do NOT add playful or rounded elements
- Do NOT use more than one accent color
- Do NOT make shadows visible — depth comes from subtle border and glow
- Do NOT use heavy font weights (700+) for body text
- Do NOT clutter — luxury = space + restraint
- Do NOT use generic "dark mode" (just inverting a light theme)

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dark Luxury</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: #09090B; color: #FAFAFA; font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    ::selection { background: #6366F1; color: #FFF; }
    a { color: #FAFAFA; text-decoration: none; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; }
    .nav-brand { font-weight: 600; font-size: 1.1rem; letter-spacing: -0.02em; }
    .nav a { color: #71717A; font-size: 0.85rem; margin-left: 28px; transition: color 0.2s; }
    .nav a:hover { color: #FAFAFA; }
    .hero { text-align: center; padding: 160px 0 120px; position: relative; }
    .hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%); pointer-events: none; }
    .hero h1 { font-size: 4rem; font-weight: 600; line-height: 1.05; letter-spacing: -0.03em; position: relative; }
    .hero p { margin-top: 20px; color: #71717A; max-width: 500px; margin-left: auto; margin-right: auto; position: relative; }
    .hero .btn { display: inline-block; margin-top: 36px; padding: 12px 28px; background: #FAFAFA; color: #09090B; border-radius: 8px; font-weight: 500; font-size: 0.9rem; position: relative; transition: opacity 0.2s; }
    .hero .btn:hover { opacity: 0.9; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); border: none; }
    .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.05); margin-top: 0; }
    .feature { background: #09090B; padding: 48px 32px; }
    .feature h3 { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: #71717A; margin-bottom: 12px; }
    .feature h2 { font-size: 1.3rem; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 8px; }
    .feature p { font-size: 0.875rem; color: #71717A; line-height: 1.6; }
    .footer { padding: 40px 0; text-align: center; color: #3F3F46; font-size: 0.75rem; }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <div class="nav-brand">Precision</div>
      <div><a href="#">Product</a><a href="#">Docs</a><a href="#">Pricing</a></div>
    </nav>
  </div>
  <div class="container">
    <div class="hero">
      <h1>Engineered for clarity</h1>
      <p>Tools built with obsessive attention to detail. Every pixel considered, every interaction refined.</p>
      <a href="#" class="btn">Start Building</a>
    </div>
  </div>
  <hr class="divider">
  <div class="features">
    <div class="feature"><h3>Performance</h3><h2>Sub-millisecond</h2><p>Optimized from the ground up for speed that you can feel.</p></div>
    <div class="feature"><h3>Design</h3><h2>Pixel-perfect</h2><p>Every element placed with mathematical precision and intention.</p></div>
    <div class="feature"><h3>Scale</h3><h2>Infinitely elastic</h2><p>Architecture that grows with you without compromising quality.</p></div>
  </div>
  <div class="container">
    <div class="footer">Precision &mdash; Built for those who notice the details</div>
  </div>
</body>
</html>
```
