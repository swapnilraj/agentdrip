# Design Skill: Swiss International

## Philosophy
Clarity through structure. The Swiss/International style treats the grid as sacred geometry. Typography is the primary visual element — not decoration, not imagery. Every element aligns to an invisible mathematical system. Whitespace is not empty; it is a deliberate compositional choice. The design communicates through hierarchy, not through ornamentation.

## The "No" List
- NO decorative elements or ornaments
- NO more than 2 typefaces (one sans-serif for headings, one for body)
- NO centered text (left-align or right-align only)
- NO border-radius
- NO gradients or shadows
- NO script or handwritten fonts
- NO full-bleed background images
- NO text smaller than 14px
- NO color used decoratively — only functionally
- NO asymmetry that doesn't serve the grid

## Design Tokens

### Colors
- `--bg`: #FFFFFF
- `--fg`: #1A1A1A
- `--accent`: #E63226 (Swiss red)
- `--muted`: #6B6B6B
- `--rule`: #1A1A1A
- Usage: 80% white, 15% black, 5% red accent

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');

body {
  font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}

h1, h2, h3 {
  font-family: 'DM Sans', 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

h1 { font-size: 3.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; }
```

### Spacing
- Base unit: 8px
- Grid: 12 columns, 24px gutters
- Vertical rhythm: multiples of 8px
- Container max-width: 1200px with 48px side margins

## CSS Enforcers
```css
* {
  box-sizing: border-box;
  border-radius: 0 !important;
}

body {
  margin: 0;
  background: #FFF;
  color: #1A1A1A;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
```

## Signature Moves

### Strong typographic scale with rules
```css
.section-header {
  border-top: 3px solid #1A1A1A;
  padding-top: 1rem;
  margin-top: 4rem;
}

.section-header h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #6B6B6B;
}
```

### Asymmetric grid with dominant column
```css
.layout-split {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 48px;
  align-items: start;
}
```

### Red accent as functional marker
```css
.marker {
  color: #E63226;
  font-weight: 700;
}

.active-nav {
  border-bottom: 3px solid #E63226;
}
```

## Responsive Behavior
- Collapse 12-column grid to 6 columns at 768px, single column at 480px
- Maintain left-alignment and typographic hierarchy at all sizes
- Reduce h1 to 2.5rem on mobile

## DO List
- DO use the 12-column grid as the foundation for all layouts
- DO use horizontal rules (2-3px solid) as section openers
- DO use uppercase small-text labels for section headers
- DO use red (#E63226) only for functional markers (active states, emphasis)

## Anti-patterns
- Do NOT center headlines — flush-left is the default
- Do NOT use color for decoration — only for signaling (active states, links, warnings)
- Do NOT add imagery without clear informational purpose
- Do NOT break the grid for visual flair
- Do NOT use font sizes between defined scale steps

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swiss International</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    * { box-sizing: border-box; border-radius: 0 !important; margin: 0; }
    body { font-family: 'Inter', Helvetica, sans-serif; color: #1A1A1A; background: #FFF; font-size: 16px; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; border-bottom: 1px solid #1A1A1A; }
    .nav a { text-decoration: none; color: #1A1A1A; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; margin-left: 32px; }
    .nav a.active { border-bottom: 2px solid #E63226; }
    .hero { padding: 96px 0 64px; }
    .hero h1 { font-size: 4rem; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; max-width: 8ch; }
    .hero p { margin-top: 32px; max-width: 480px; color: #6B6B6B; }
    .section { border-top: 2px solid #1A1A1A; padding-top: 16px; margin-top: 64px; }
    .section-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: #6B6B6B; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 32px; }
    .grid-3 h3 { font-size: 1.25rem; margin-bottom: 8px; }
    .grid-3 p { font-size: 0.875rem; color: #6B6B6B; }
    .footer { margin-top: 96px; padding: 24px 0; border-top: 1px solid #1A1A1A; font-size: 0.75rem; color: #6B6B6B; }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <strong>Studio</strong>
      <div><a href="#" class="active">Work</a><a href="#">About</a><a href="#">Contact</a></div>
    </nav>
    <div class="hero">
      <h1>Clarity through structure</h1>
      <p>Design communicates through hierarchy, proportion, and the deliberate use of space.</p>
    </div>
    <div class="section">
      <span class="section-label">Services</span>
      <div class="grid-3">
        <div><h3>Identity</h3><p>Brand systems built on typographic foundations and mathematical grids.</p></div>
        <div><h3>Editorial</h3><p>Publication design with rigorous vertical rhythm and clear hierarchy.</p></div>
        <div><h3>Digital</h3><p>Web experiences where content structure drives every visual decision.</p></div>
      </div>
    </div>
    <div class="footer">Swiss International Design &mdash; Grid, Type, Clarity</div>
  </div>
</body>
</html>
```
