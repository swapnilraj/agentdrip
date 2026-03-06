# Design Skill: Organic Soft

## Philosophy
Warmth, comfort, and approachability. Inspired by Headspace, Linear's softer moments, and Scandinavian product design. Everything has rounded edges, soft shadows, and pastel gradients. The interface feels like it was made of marshmallow or clay. It's the antithesis of sharp corporate design — gentle, inviting, and almost tangible. Colors blend like watercolors. Surfaces feel touchable.

## The "No" List
- NO sharp corners (minimum border-radius: 12px, prefer 16-24px)
- NO pure black text (use dark grey or dark purple)
- NO hard borders (use soft shadows or subtle color shifts instead)
- NO high-contrast stark combinations
- NO aggressive uppercase headings
- NO monospace fonts
- NO heavy font weights above 700
- NO abrupt color transitions
- NO dense information layouts
- NO dark backgrounds (keep it light and airy)

## Design Tokens

### Colors
- `--bg`: #F8F5FF (lavender-tinted white)
- `--fg`: #3D3455 (dark purple-grey)
- `--muted`: #9B92B5 (soft purple-grey)
- `--accent-1`: #B8A9E8 (soft violet)
- `--accent-2`: #F4B8D4 (soft pink)
- `--accent-3`: #A8D8EA (soft blue)
- `--surface`: #FFFFFF
- `--gradient`: linear-gradient(135deg, #F4B8D4, #B8A9E8, #A8D8EA)
- Usage: 70% soft whites, 20% pastels, 10% darker text

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Nunito:wght@400;600;700&display=swap');

body {
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.7;
  font-weight: 400;
  color: #3D3455;
}

h1, h2 {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  line-height: 1.25;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1rem; font-weight: 600; }
```

### Spacing
- Base unit: 8px
- Generous padding: 24-40px inside cards
- Section spacing: 80-120px
- Max container width: 1000px
- Everything feels spacious, not cramped

## CSS Enforcers
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #F8F5FF;
  color: #3D3455;
}

img {
  border-radius: 16px;
}

::selection {
  background: #B8A9E8;
  color: #FFF;
}
```

## Signature Moves

### Soft card with layered shadow
```css
.card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 2px 4px rgba(61, 52, 85, 0.04),
    0 8px 16px rgba(61, 52, 85, 0.06),
    0 24px 48px rgba(61, 52, 85, 0.04);
}
```

### Gradient accent blob
```css
.blob {
  width: 200px;
  height: 200px;
  border-radius: 50% 40% 60% 50% / 50% 60% 40% 50%;
  background: linear-gradient(135deg, #F4B8D4, #B8A9E8);
  filter: blur(40px);
  opacity: 0.5;
  position: absolute;
  z-index: -1;
}
```

### Pill button
```css
.btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: linear-gradient(135deg, #B8A9E8, #A8D8EA);
  color: #FFF;
  border: none;
  border-radius: 100px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(184, 169, 232, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(184, 169, 232, 0.4);
}
```

### Subtle glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
}
```

## Responsive Behavior
- Stack card grids to single column below 640px
- Maintain large border-radius (16-24px) at all sizes
- Reduce section padding from 120px to 60px on mobile

## DO List
- DO use layered soft shadows (multiple box-shadow values) on cards
- DO use gradient pill buttons with 100px border-radius
- DO use the pastel gradient (pink → violet → blue) for accent elements
- DO keep all corners rounded (minimum 12px border-radius)
- DO use generous padding inside cards (32px+)

## Anti-patterns
- Do NOT use flat backgrounds without texture or gradient
- Do NOT use hard 1px borders
- Do NOT use sharp 0px border-radius anywhere
- Do NOT use dark mode
- Do NOT use aggressive/loud colors at full saturation
- Do NOT make hover states jarring — keep everything smooth (0.2s+ transitions)

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Softly</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #F8F5FF; color: #3D3455; font-size: 16px; line-height: 1.7; }
    ::selection { background: #B8A9E8; color: #FFF; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 32px; }
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; }
    .nav-brand { font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 1.3rem; }
    .nav a { color: #9B92B5; text-decoration: none; margin-left: 24px; font-size: 0.9rem; }
    .hero { text-align: center; padding: 100px 0 80px; position: relative; }
    .hero-blob { width: 300px; height: 300px; border-radius: 50% 40% 60% 50% / 50% 60% 40% 50%; background: linear-gradient(135deg, #F4B8D4, #B8A9E8, #A8D8EA); filter: blur(60px); opacity: 0.4; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; }
    .hero h1 { font-family: 'Nunito', sans-serif; font-size: 3rem; font-weight: 700; line-height: 1.2; position: relative; z-index: 1; }
    .hero p { color: #9B92B5; margin-top: 16px; max-width: 460px; margin-left: auto; margin-right: auto; position: relative; z-index: 1; }
    .hero .btn { display: inline-block; margin-top: 32px; padding: 14px 36px; background: linear-gradient(135deg, #B8A9E8, #A8D8EA); color: #FFF; border-radius: 100px; text-decoration: none; font-weight: 600; box-shadow: 0 6px 16px rgba(184,169,232,0.3); position: relative; z-index: 1; transition: transform 0.2s, box-shadow 0.2s; }
    .hero .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(184,169,232,0.4); }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 40px 0 100px; }
    .card { background: #FFF; border-radius: 20px; padding: 32px; box-shadow: 0 2px 4px rgba(61,52,85,0.04), 0 8px 16px rgba(61,52,85,0.06); }
    .card-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #F4B8D4, #B8A9E8); margin-bottom: 20px; }
    .card h3 { font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .card p { font-size: 0.9rem; color: #9B92B5; }
    .footer { text-align: center; padding: 32px 0; color: #9B92B5; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <div class="nav-brand">Softly</div>
      <div><a href="#">Features</a><a href="#">About</a><a href="#">Contact</a></div>
    </nav>
    <div class="hero">
      <div class="hero-blob"></div>
      <h1>Design that feels like a warm hug</h1>
      <p>Gentle interfaces that put people first. No sharp edges, no cold pixels.</p>
      <a href="#" class="btn">Get Started</a>
    </div>
    <div class="cards">
      <div class="card"><div class="card-icon"></div><h3>Approachable</h3><p>Soft corners and gentle colors make every interaction feel welcoming.</p></div>
      <div class="card"><div class="card-icon" style="background: linear-gradient(135deg, #A8D8EA, #B8A9E8);"></div><h3>Playful</h3><p>Subtle animations and rounded shapes add a touch of delight.</p></div>
      <div class="card"><div class="card-icon" style="background: linear-gradient(135deg, #B8A9E8, #F4B8D4);"></div><h3>Calm</h3><p>Generous spacing and muted palettes create a peaceful experience.</p></div>
    </div>
    <div class="footer">Made with care</div>
  </div>
</body>
</html>
```
