# Design Skill: Japanese Minimal

## Philosophy
Ma (間) — the conscious use of negative space as a compositional element. Inspired by wabi-sabi (beauty in imperfection) and Japanese interior design. The page breathes. Every element earns its place. The design whispers rather than shouts. Restraint is the primary tool. Natural materials and muted warmth replace cold minimalism.

## The "No" List
- NO bold saturated colors
- NO heavy borders or thick rules
- NO uppercase text
- NO text larger than 3rem for headings
- NO more than 1 accent color
- NO dense layouts or information overload
- NO decorative icons or emoji
- NO hard black (#000) — use near-black instead
- NO animations faster than 0.4s
- NO grid layouts with more than 3 columns

## Design Tokens

### Colors
- `--bg`: #F7F5F0 (warm off-white, like handmade paper)
- `--fg`: #2C2C2C (soft near-black)
- `--muted`: #8C8880 (warm grey)
- `--accent`: #B8564F (terracotta/vermillion, used sparingly)
- `--surface`: #EDEBE6 (slightly darker warm white)
- Usage: 75% warm white, 15% text, 8% muted, 2% accent

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400&display=swap');

body {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 15px;
  line-height: 1.8;
  font-weight: 300;
  letter-spacing: 0.01em;
}

h1, h2 {
  font-family: 'Noto Serif', 'Georgia', serif;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 0.8rem; text-transform: none; letter-spacing: 0.15em; color: #8C8880; }
```

### Spacing
- Base unit: 8px
- Generous vertical spacing: sections separated by 120px+
- Content max-width: 720px for text, 960px for layouts
- Asymmetric margins — left-heavy or centered

## CSS Enforcers
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #F7F5F0;
  color: #2C2C2C;
}

img {
  display: block;
  max-width: 100%;
}

::selection {
  background: #B8564F;
  color: #F7F5F0;
}
```

## Signature Moves

### Breathing vertical rhythm
```css
.section {
  padding: 120px 0;
}

.section + .section {
  border-top: 1px solid #EDEBE6;
}
```

### Delicate horizontal rule
```css
hr {
  border: none;
  height: 1px;
  background: #EDEBE6;
  margin: 80px auto;
  max-width: 120px;
}
```

### Single-column centered prose
```css
.prose {
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
}

.prose p + p {
  margin-top: 1.5em;
}
```

### Subtle image presentation
```css
.image-frame {
  padding: 24px;
  background: #EDEBE6;
}

.image-frame img {
  display: block;
  width: 100%;
}
```

## Responsive Behavior
- Maintain single-column layouts at all sizes — no breakpoint-driven restructuring
- Reduce section padding from 120px to 80px below 768px
- Keep max-width constraints on text containers

## DO List
- DO use generous vertical spacing (120px+) between sections
- DO use thin 1px horizontal rules as subtle dividers
- DO keep font weights light (300-400 for body, 400-600 for headings)
- DO use the accent color (#B8564F) for only 1-2 small elements per page

## Anti-patterns
- Do NOT fill the page — let it breathe
- Do NOT use bright white (#FFF) as background
- Do NOT use heavy font weights (700+)
- Do NOT add hover effects that are visually loud
- Do NOT crowd sections — keep visual density low (generous spacing between elements)
- Do NOT mistake this for "empty" — every gap is intentional

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Japanese Minimal</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600&family=Inter:wght@300;400&display=swap');
    * { box-sizing: border-box; margin: 0; }
    body { font-family: 'Inter', sans-serif; font-weight: 300; font-size: 15px; line-height: 1.8; color: #2C2C2C; background: #F7F5F0; }
    ::selection { background: #B8564F; color: #F7F5F0; }
    .container { max-width: 720px; margin: 0 auto; padding: 0 32px; }
    .nav { padding: 32px 0; display: flex; justify-content: space-between; align-items: center; }
    .nav a { color: #8C8880; text-decoration: none; font-size: 0.8rem; letter-spacing: 0.1em; margin-left: 24px; }
    .hero { padding: 160px 0 120px; text-align: center; }
    .hero h1 { font-family: 'Noto Serif', serif; font-size: 2.5rem; font-weight: 400; line-height: 1.3; }
    .hero p { margin-top: 24px; color: #8C8880; max-width: 400px; margin-left: auto; margin-right: auto; }
    hr { border: none; height: 1px; background: #EDEBE6; margin: 0 auto; max-width: 80px; }
    .section { padding: 100px 0; }
    .section h2 { font-family: 'Noto Serif', serif; font-weight: 400; font-size: 1.5rem; margin-bottom: 16px; }
    .section p { color: #8C8880; }
    .footer { padding: 60px 0; text-align: center; font-size: 0.75rem; color: #8C8880; letter-spacing: 0.1em; }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <span style="font-family: 'Noto Serif', serif; font-size: 1.1rem;">Studio</span>
      <div><a href="#">Work</a><a href="#">About</a><a href="#">Contact</a></div>
    </nav>
    <div class="hero">
      <h1>The beauty of less</h1>
      <p>In restraint, we find clarity. In emptiness, we find space to think.</p>
    </div>
    <hr>
    <div class="section">
      <h2>Approach</h2>
      <p>We believe design should feel like a quiet room. Every element placed with intention, nothing competing for attention.</p>
    </div>
    <hr>
    <div class="section">
      <h2>Practice</h2>
      <p>Working slowly and deliberately, letting the work reveal itself through reduction rather than addition.</p>
    </div>
    <div class="footer">Crafted with care</div>
  </div>
</body>
</html>
```
