# Design Skill: Editorial

## Philosophy
The magazine spread brought to screen. Editorial design treats the page as a canvas where typography and imagery dance in deliberate tension. Inspired by print publications — The Paris Review, Bloomberg Businessweek, Monocle. Typography is expressive and varied. Layout is asymmetric but intentional. Every page turn should feel like a new composition. The reader is guided by visual weight, not UI conventions.

## The "No" List
- NO uniform card grids — every section should have unique composition
- NO single typeface — editorial demands typographic variety (2-3 families)
- NO default link styling (no blue underlines)
- NO UI-style buttons — use typographic CTAs instead
- NO uniform spacing between all sections
- NO stock-photo-style imagery (prefer photojournalistic, illustration, or abstract)
- NO sidebar navigation patterns
- NO hamburger menus
- NO monospace fonts for body text

## Design Tokens

### Colors
- `--bg`: #FAFAF8 (warm paper white)
- `--fg`: #1C1C1C
- `--accent`: #D4380D (editorial red)
- `--muted`: #888888
- `--pull-quote`: #1C1C1C
- `--rule`: #CCCCCC
- Usage: light backgrounds, strong text contrast, red for emphasis only

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Sans+3:wght@300;400;600&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');

body {
  font-family: 'Source Sans 3', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}

h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 900;
  font-size: 4.5rem;
  line-height: 1.0;
  letter-spacing: -0.03em;
}

h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 400;
  font-style: italic;
  font-size: 2rem;
  line-height: 1.2;
}

h3 {
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #888;
}

.body-serif {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 18px;
  line-height: 1.75;
}
```

### Spacing
- Generous: 80-160px between major sections
- Tight: 4-8px between related elements (kicker + headline)
- Text columns: 60-75 characters wide max
- Asymmetric margins common

## CSS Enforcers
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #FAFAF8;
  color: #1C1C1C;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}
```

## Signature Moves

### Kicker + headline pattern
```css
.kicker {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #D4380D;
  margin-bottom: 4px;
}

.headline {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.05;
}
```

### Pull quote
```css
.pull-quote {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-style: italic;
  line-height: 1.3;
  border-left: 3px solid #D4380D;
  padding-left: 24px;
  margin: 48px 0;
  max-width: 500px;
}
```

### Magazine-style asymmetric layout
```css
.feature-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 48px;
  align-items: start;
}

.feature-image {
  width: 100%;
  margin-left: -48px; /* bleed effect */
}
```

### Byline and metadata
```css
.byline {
  font-size: 0.875rem;
  color: #888;
  margin-top: 16px;
}

.byline strong {
  color: #1C1C1C;
}
```

## Responsive Behavior
- Collapse multi-column layouts to single column below 768px
- Feature images should go full-width on mobile (remove negative margin bleed)
- Maintain kicker > headline > deck hierarchy at all sizes

## DO List
- DO vary section layouts — no two consecutive sections should look identical
- DO use the kicker > headline > deck > body hierarchy for article entries
- DO use pull quotes with left border accent for breaking up long text
- DO use at least 2 typeface families (serif for headlines, sans for body)

## Anti-patterns
- Do NOT make every section look the same — vary the layout
- Do NOT use icon-heavy navigation
- Do NOT use cards with equal-height constraints
- Do NOT left-align everything uniformly — mix alignments
- Do NOT use monochromatic color schemes
- Do NOT forget the typographic hierarchy (kicker > headline > deck > body)

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Review</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Source+Sans+3:wght@300;400;600&family=Source+Serif+4:ital,wght@0,400;1,400&display=swap');
    * { box-sizing: border-box; margin: 0; }
    body { font-family: 'Source Sans 3', sans-serif; background: #FAFAF8; color: #1C1C1C; font-size: 16px; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
    .masthead { padding: 20px 0; border-bottom: 1px solid #CCC; display: flex; justify-content: space-between; align-items: baseline; }
    .masthead h1 { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; }
    .masthead nav a { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; margin-left: 24px; color: #888; }
    .feature { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; padding: 80px 0; align-items: start; }
    .feature-img { background: #E5E5E0; width: 100%; aspect-ratio: 4/5; }
    .feature-text .kicker { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: #D4380D; }
    .feature-text h2 { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; line-height: 1.05; margin-top: 8px; }
    .feature-text .deck { font-family: 'Source Serif 4', serif; font-size: 1.1rem; color: #555; margin-top: 16px; line-height: 1.6; }
    .feature-text .byline { font-size: 0.8rem; color: #888; margin-top: 24px; }
    .divider { border: none; border-top: 1px solid #CCC; margin: 0; }
    .stories { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; padding: 48px 0; }
    .stories .kicker { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: #888; }
    .stories h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 400; margin-top: 4px; line-height: 1.25; }
    .stories p { font-size: 0.85rem; color: #888; margin-top: 8px; }
    .footer { padding: 32px 0; border-top: 1px solid #CCC; font-size: 0.75rem; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="masthead">
      <h1>The Review</h1>
      <nav><a href="#">Essays</a><a href="#">Fiction</a><a href="#">Archive</a></nav>
    </div>
    <div class="feature">
      <div class="feature-img"></div>
      <div class="feature-text">
        <div class="kicker">On the Daily</div>
        <h2>The Weight of Small Decisions</h2>
        <div class="deck">How the accumulation of minor choices shapes the architecture of a life, and why we rarely notice until it's too late.</div>
        <div class="byline">By <strong>Elena Marchetti</strong> &mdash; March 2026</div>
      </div>
    </div>
    <hr class="divider">
    <div class="stories">
      <div><div class="kicker">Fiction</div><h3>The Last Garden on the Block</h3><p>A short story about inheritance, soil, and the things we choose to tend.</p></div>
      <div><div class="kicker">Essay</div><h3>Against Efficiency</h3><p>Why the obsession with optimization is hollowing out our capacity for surprise.</p></div>
      <div><div class="kicker">Interview</div><h3>Conversations with Silence</h3><p>A composer on the art of listening to what isn't there.</p></div>
    </div>
    <div class="footer">The Review &mdash; Published since 1953</div>
  </div>
</body>
</html>
```
