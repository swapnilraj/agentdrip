# Second Opinion Request

## Question
Review these 10 design skill files and their generated test pages. For each skill, evaluate: 1) Does the generated HTML faithfully match the design philosophy? 2) Are the design tokens (colors, typography, spacing) correctly applied? 3) Is there enough differentiation between styles? 4) What's missing or could be improved in the skill file format?

## Context

### Files Referenced

#### skills/01-brutalist.md

````
# Design Skill: Brutalist

## Philosophy
Raw, honest, structural. The design exposes its own construction — it looks like a blueprint or database dump. It rejects polish, smoothness, and conventional UX pleasantries. Content is the interface. The aesthetic comes from the absence of aesthetic.

## The "No" List
- NO border-radius anywhere
- NO box-shadows or depth effects
- NO gradients
- NO opacity or transparency
- NO smooth transitions or animations
- NO subtle greys — use pure black #000 and pure white #FFF
- NO centered hero layouts with large padding
- NO stock photography or decorative imagery
- NO more than 2 typefaces
- NO comfortable whitespace — either cramped or deliberately vast

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

````

#### skills/02-swiss-international.md

````
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
h3 { font-size: 1.25rem; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.875rem; }
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

````

#### skills/03-japanese-minimal.md

````
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

## Anti-patterns
- Do NOT fill the page — let it breathe
- Do NOT use bright white (#FFF) as background
- Do NOT use heavy font weights (700+)
- Do NOT add hover effects that are visually loud
- Do NOT use more than 3 elements visible at once in any viewport
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

````

#### skills/04-y2k.md

````
# Design Skill: Y2K Aesthetic

## Philosophy
The internet as a frontier — chaotic, glossy, and optimistic. Y2K design celebrates the late-90s/early-2000s digital excess: chrome gradients, bubble shapes, pixelated textures, and the thrill of new technology. It's the visual language of AIM, early Flash sites, and Windows XP. Futuristic yet nostalgic. Sleek yet kitschy. Everything glows.

## The "No" List
- NO flat design — everything needs depth, gloss, or texture
- NO modern sans-serif fonts (Inter, SF Pro, etc.)
- NO clean minimalism
- NO muted earthy tones
- NO large whitespace areas
- NO CSS grid (use absolute positioning and tables for that era feel)
- NO subtle anything — Y2K is maximal
- NO responsive-first thinking — design for a fixed 800-1024px width

## Design Tokens

### Colors
- `--bg`: #1A0A2E (deep purple/black) or #000000
- `--chrome`: linear-gradient(135deg, #C0C0C0, #FFFFFF, #C0C0C0) (metallic)
- `--glow-blue`: #00CCFF
- `--glow-pink`: #FF66CC
- `--glow-green`: #00FF66
- `--text`: #FFFFFF
- `--text-secondary`: #AAAACC
- Usage: dark backgrounds, neon accents, metallic highlights

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=VT323&display=swap');

body {
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 16px;
  line-height: 1.5;
  color: #FFFFFF;
}

h1, h2 {
  font-family: 'Orbitron', 'Impact', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

h1 { font-size: 3rem; }
h2 { font-size: 1.5rem; }
```

### Spacing
- No consistent spacing system — intentionally irregular
- Overlap elements with negative margins or absolute positioning
- Fixed-width centered container (800-960px)
- Heavy padding inside elements (20px+)

## CSS Enforcers
```css
body {
  margin: 0;
  background: #1A0A2E;
  color: #FFF;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

::selection {
  background: #FF66CC;
  color: #000;
}
```

## Signature Moves

### Neon glow text
```css
.glow {
  text-shadow:
    0 0 5px #00CCFF,
    0 0 10px #00CCFF,
    0 0 20px #00CCFF,
    0 0 40px #0066FF;
}
```

### Chrome/metallic gradient
```css
.chrome {
  background: linear-gradient(135deg, #666, #FFF 30%, #999 50%, #FFF 70%, #666);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Beveled container (OS window look)
```css
.window {
  background: #2A1A4E;
  border: 2px solid;
  border-color: #666 #333 #333 #666;
  padding: 0;
}

.window-titlebar {
  background: linear-gradient(to right, #000066, #0033CC, #000066);
  padding: 4px 8px;
  font-size: 12px;
  color: #FFF;
  display: flex;
  justify-content: space-between;
}

.window-body {
  padding: 16px;
}
```

### Animated starfield background
```css
.starfield {
  background: #000 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="20" cy="30" r="1" fill="%23FFF"/><circle cx="80" cy="70" r="0.5" fill="%23AAF"/><circle cx="150" cy="40" r="1" fill="%23FFF"/><circle cx="40" cy="140" r="0.5" fill="%23FFF"/><circle cx="120" cy="160" r="1" fill="%23CCF"/><circle cx="170" cy="120" r="0.5" fill="%23FFF"/></svg>');
}
```

### Scrolling marquee
```css
.marquee {
  overflow: hidden;
  white-space: nowrap;
  border-top: 1px solid #00CCFF;
  border-bottom: 1px solid #00CCFF;
  padding: 8px 0;
}

.marquee span {
  display: inline-block;
  animation: marquee 15s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(100vw); }
  to { transform: translateX(-100%); }
}
```

## Anti-patterns
- Do NOT make it clean or modern-looking
- Do NOT use system fonts
- Do NOT use light backgrounds
- Do NOT restrain the color palette — more neon is more Y2K
- Do NOT forget window chrome and bevels
- Do NOT use modern border-radius (use 0 or very small like 2px)

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Y2K ZONE</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=VT323&display=swap');
    * { box-sizing: border-box; margin: 0; }
    body { font-family: 'VT323', monospace; background: #0A0015; color: #FFF; font-size: 16px; line-height: 1.5; }
    .page { max-width: 900px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 40px 0; }
    .header h1 { font-family: 'Orbitron', sans-serif; font-size: 3rem; font-weight: 900; text-transform: uppercase; text-shadow: 0 0 10px #00CCFF, 0 0 20px #00CCFF, 0 0 40px #0066FF; }
    .header p { color: #AAAACC; margin-top: 8px; }
    .marquee { overflow: hidden; white-space: nowrap; border-top: 1px solid #FF66CC; border-bottom: 1px solid #FF66CC; padding: 6px 0; color: #FF66CC; font-size: 14px; }
    .marquee span { display: inline-block; animation: scroll 20s linear infinite; }
    @keyframes scroll { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }
    .window { background: #1A0A3E; border: 2px solid; border-color: #555 #222 #222 #555; margin: 20px 0; }
    .window-bar { background: linear-gradient(to right, #000066, #0033CC, #000066); padding: 4px 8px; font-size: 13px; display: flex; justify-content: space-between; }
    .window-bar .buttons span { display: inline-block; width: 12px; height: 12px; border: 1px solid; border-color: #999 #333 #333 #999; margin-left: 2px; font-size: 9px; text-align: center; line-height: 12px; }
    .window-body { padding: 16px; }
    .window-body h2 { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; color: #00CCFF; margin-bottom: 8px; }
    .columns { display: flex; gap: 20px; }
    .columns > div { flex: 1; }
    .btn { display: inline-block; padding: 8px 24px; background: linear-gradient(to bottom, #555, #222); border: 2px solid; border-color: #777 #333 #333 #777; color: #00CCFF; font-family: 'VT323', monospace; font-size: 16px; cursor: pointer; text-transform: uppercase; }
    .btn:hover { background: linear-gradient(to bottom, #666, #333); color: #FFF; }
    .footer { text-align: center; padding: 30px; color: #555; font-size: 13px; }
    .footer a { color: #FF66CC; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>Welcome to the Zone</h1>
      <p>[ Established 1999 ] :: Your portal to the future</p>
    </div>
    <div class="marquee"><span>*** WELCOME *** NEW CONTENT UPDATED DAILY *** BEST VIEWED AT 1024x768 *** SIGN THE GUESTBOOK ***</span></div>
    <div class="columns">
      <div class="window">
        <div class="window-bar"><span>navigation.exe</span><div class="buttons"><span>_</span><span>x</span></div></div>
        <div class="window-body">
          <h2>Navigate</h2>
          <p>> <a href="#" style="color:#00FF66">Enter the Matrix</a><br>> <a href="#" style="color:#00FF66">Downloads</a><br>> <a href="#" style="color:#00FF66">Guestbook</a></p>
        </div>
      </div>
      <div class="window">
        <div class="window-bar"><span>news.exe</span><div class="buttons"><span>_</span><span>x</span></div></div>
        <div class="window-body">
          <h2>Latest Updates</h2>
          <p>New backgrounds added to the collection. Check the downloads section for fresh pixel art.</p>
          <br><button class="btn">Enter &gt;&gt;</button>
        </div>
      </div>
    </div>
    <div class="footer">Visitors: 004,832 | <a href="#">Sign Guestbook</a> | Best viewed in Netscape Navigator</div>
  </div>
</body>
</html>
```

````

#### skills/05-editorial.md

````
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
- NO monospace fonts

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

````

#### skills/06-retro-pixel.md

````
# Design Skill: Retro Pixel

## Philosophy
The 8-bit and 16-bit era brought to the web. Inspired by Game Boy, NES, early Mac OS, and DOS interfaces. Everything is built on a visible pixel grid. Colors are limited like a hardware palette. Interfaces reference windowed operating systems and game UIs. The aesthetic is playful, constrained, and chunky. Pixels are never anti-aliased — they are celebrated.

## The "No" List
- NO anti-aliased text rendering (use pixel fonts)
- NO smooth gradients
- NO photography or photorealistic images
- NO border-radius (except 0)
- NO font sizes below 16px (keep pixels visible)
- NO modern UI patterns (no hamburger menus, no cards with shadows)
- NO opacity or transparency
- NO CSS transitions or smooth animations (use step() timing)
- NO more than 8 colors per palette

## Design Tokens

### Colors
- `--bg`: #2B2B3D (dark purple-grey, Game Boy-esque)
- `--fg`: #E8E8D0 (warm cream)
- `--green`: #6ABE30 (pixel green)
- `--blue`: #5B6EE1 (classic blue)
- `--red`: #AC3232 (warning red)
- `--yellow`: #FBF236 (highlight yellow)
- `--dark`: #1A1A2E
- `--mid`: #76768A
- Usage: dark backgrounds, bright pixel accents, limited palette per section

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

body {
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 20px;
  line-height: 1.4;
  image-rendering: pixelated;
}

h1, h2, h3 {
  font-family: 'Press Start 2P', monospace;
  line-height: 1.6;
}

h1 { font-size: 24px; }
h2 { font-size: 16px; }
h3 { font-size: 12px; }
```

### Spacing
- Base unit: 8px (pixel grid aligned)
- All spacing in multiples of 8px
- Tight padding inside containers (8-16px)
- Fixed-width layouts (640px or 800px)

## CSS Enforcers
```css
* {
  box-sizing: border-box;
  border-radius: 0 !important;
  image-rendering: pixelated;
}

body {
  margin: 0;
  background: #2B2B3D;
  color: #E8E8D0;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
}

::selection {
  background: #6ABE30;
  color: #1A1A2E;
}
```

## Signature Moves

### Pixel border (double-line inset)
```css
.pixel-box {
  border: 4px solid #E8E8D0;
  outline: 4px solid #76768A;
  outline-offset: -8px;
  padding: 16px;
  background: #1A1A2E;
}
```

### OS-style window
```css
.os-window {
  background: #1A1A2E;
  border: 4px solid #E8E8D0;
}

.os-window-title {
  background: #5B6EE1;
  color: #E8E8D0;
  padding: 4px 8px;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  display: flex;
  justify-content: space-between;
}

.os-window-body {
  padding: 16px;
}
```

### Step animations (no smooth)
```css
.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor::after {
  content: '█';
  animation: blink 0.8s step-end infinite;
}
```

### Pixel art divider
```css
.pixel-divider {
  height: 8px;
  background: repeating-linear-gradient(
    90deg,
    #6ABE30 0px, #6ABE30 8px,
    #5B6EE1 8px, #5B6EE1 16px,
    #AC3232 16px, #AC3232 24px,
    #FBF236 24px, #FBF236 32px
  );
  margin: 24px 0;
}
```

## Anti-patterns
- Do NOT use smooth fonts — pixel fonts are mandatory
- Do NOT use modern layout patterns (flexbox is OK but keep it simple)
- Do NOT exceed the 8-color palette
- Do NOT use subtle hover states — make interactions obvious and chunky
- Do NOT use rem units — use px for pixel-perfect alignment

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PIXEL ZONE</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
    * { box-sizing: border-box; border-radius: 0 !important; margin: 0; image-rendering: pixelated; }
    body { font-family: 'VT323', monospace; font-size: 20px; line-height: 1.4; background: #2B2B3D; color: #E8E8D0; -webkit-font-smoothing: none; }
    .page { max-width: 640px; margin: 0 auto; padding: 16px; }
    .header { border: 4px solid #E8E8D0; padding: 16px; text-align: center; margin-bottom: 16px; }
    .header h1 { font-family: 'Press Start 2P', monospace; font-size: 20px; color: #6ABE30; }
    .header p { margin-top: 8px; color: #76768A; }
    .divider { height: 8px; background: repeating-linear-gradient(90deg, #6ABE30 0px, #6ABE30 8px, #5B6EE1 8px, #5B6EE1 16px, #AC3232 16px, #AC3232 24px, #FBF236 24px, #FBF236 32px); margin: 16px 0; }
    .window { background: #1A1A2E; border: 4px solid #E8E8D0; margin-bottom: 16px; }
    .window-title { background: #5B6EE1; color: #E8E8D0; padding: 4px 8px; font-family: 'Press Start 2P', monospace; font-size: 10px; }
    .window-body { padding: 16px; }
    .window-body h2 { font-family: 'Press Start 2P', monospace; font-size: 14px; color: #FBF236; margin-bottom: 8px; }
    .menu a { display: block; color: #6ABE30; padding: 4px 0; }
    .menu a:hover { background: #6ABE30; color: #1A1A2E; }
    .btn { display: inline-block; padding: 8px 16px; background: #5B6EE1; color: #E8E8D0; border: 3px solid; border-color: #8B9EFF #3344AA #3344AA #8B9EFF; font-family: 'Press Start 2P', monospace; font-size: 10px; cursor: pointer; }
    .btn:active { border-color: #3344AA #8B9EFF #8B9EFF #3344AA; }
    .footer { text-align: center; padding: 16px; color: #76768A; font-size: 16px; }
    .blink { animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>PIXEL ZONE</h1>
      <p>[ EST. 1992 ]</p>
    </div>
    <div class="divider"></div>
    <div class="window">
      <div class="window-title">menu.exe</div>
      <div class="window-body">
        <div class="menu">
          <a href="#">> Start Game</a>
          <a href="#">> Load Save</a>
          <a href="#">> Options</a>
          <a href="#">> Credits</a>
        </div>
      </div>
    </div>
    <div class="window">
      <div class="window-title">news.txt</div>
      <div class="window-body">
        <h2>Latest News</h2>
        <p>New pixel art collection uploaded. Check the gallery for 16x16 sprite sheets and tile maps.</p>
        <br>
        <button class="btn">VIEW &gt;&gt;</button>
      </div>
    </div>
    <div class="footer">VISITORS: 001,247 <span class="blink">_</span></div>
  </div>
</body>
</html>
```

````

#### skills/07-organic-soft.md

````
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

````

#### test-pages/01-brutalist-landing.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GRIDLOCK — OPEN SOURCE LAYOUT ENGINE</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; border-radius: 0 !important; margin: 0; padding: 0; }
    body { font-family: 'Space Mono', 'Courier New', Courier, monospace; font-size: 16px; line-height: 1.4; background: #FFF; color: #000; }
    h1, h2, h3 { font-family: Helvetica, Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 900; }
    h1 { font-size: 4rem; }
    h2 { font-size: 2.5rem; }
    h3 { font-size: 1.5rem; }
    a { color: #0000FF; text-decoration: underline; }
    a:hover { background: #0000FF; color: #FFF; text-decoration: none; }
    hr { border: none; border-top: 2px solid #000; margin: 2rem 0; }
    .inverted { background: #000; color: #FFF; display: inline-block; padding: 0.25rem 0.5rem; }

    .header { border-bottom: 3px solid #000; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
    .header h3 { font-size: 1.25rem; }
    .header nav a { margin-left: 1rem; font-size: 0.875rem; text-transform: uppercase; }

    .hero { padding: 1rem; border-bottom: 2px solid #000; }
    .hero h1 { font-size: 6rem; line-height: 0.9; }
    .hero p { margin-top: 1rem; max-width: 500px; }

    .install-block { border-bottom: 2px solid #000; padding: 1rem; }
    .install-block code { background: #000; color: #FFF; padding: 0.25rem 0.5rem; font-family: 'Space Mono', 'Courier New', Courier, monospace; font-size: 1.125rem; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); border-bottom: 2px solid #000; }
    .grid > div { border: 1px solid #000; padding: 1rem; }

    .code-sample { border-bottom: 2px solid #000; padding: 1rem; }
    .code-sample pre { background: #000; color: #FFF; padding: 1rem; font-family: 'Space Mono', 'Courier New', Courier, monospace; font-size: 0.875rem; overflow-x: auto; }

    .stats { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; border-bottom: 2px solid #000; }
    .stats > div { border: 1px solid #000; padding: 1rem; }
    .stats h2 { margin-bottom: 0.25rem; }
    .stats p { font-size: 0.75rem; text-transform: uppercase; }

    .cta { border-bottom: 2px solid #000; padding: 1rem; }
    .cta a.btn { background: #000; color: #FFF; padding: 0.5rem 1rem; text-decoration: none; font-family: Helvetica, Arial, sans-serif; text-transform: uppercase; font-weight: 900; font-size: 1.25rem; display: inline-block; margin-right: 1rem; }
    .cta a.btn:hover { background: #0000FF; }

    .footer { border-top: 3px solid #000; padding: 1rem; font-size: 0.75rem; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="header">
    <h3>Gridlock</h3>
    <nav><a href="#features">Features</a> / <a href="#docs">Docs</a> / <a href="https://github.com">GitHub</a></nav>
  </div>

  <div class="hero">
    <h1>Gridlock.</h1>
    <p>A CSS layout engine that does one thing. Grid layouts without the guesswork. 2kb. No dependencies. No JavaScript. MIT license.</p>
  </div>

  <div class="install-block">
    <span class="inverted">Install</span>
    <br><br>
    <code>npm install gridlock-css</code>
  </div>

  <div style="padding: 1rem; border-bottom: 2px solid #000;">
    <span class="inverted">Features</span>
  </div>

  <div class="grid" id="features">
    <div>
      <h3>01 / Declarative</h3>
      <p>Define layouts in plain CSS custom properties. No build step. No config files. No abstractions over abstractions.</p>
    </div>
    <div>
      <h3>02 / Tiny</h3>
      <p>2kb gzipped. Ships as a single CSS file. Works in every browser made after 2020. No polyfills.</p>
    </div>
    <div>
      <h3>03 / Composable</h3>
      <p>Nest grids inside grids. Stack them. Break them. The system does not care about your intentions.</p>
    </div>
    <div>
      <h3>04 / No JS</h3>
      <p>Pure CSS. No runtime. No event listeners. No render cycles. It loads and it works. That is all.</p>
    </div>
  </div>

  <div class="code-sample" id="docs">
    <span class="inverted">Usage</span>
    <br><br>
    <pre>&lt;div class="gl" style="--cols: 3; --gap: 1rem;"&gt;
  &lt;div&gt;Column 1&lt;/div&gt;
  &lt;div&gt;Column 2&lt;/div&gt;
  &lt;div&gt;Column 3&lt;/div&gt;
&lt;/div&gt;</pre>
  </div>

  <div class="stats">
    <div>
      <h2>2kb</h2>
      <p>Gzipped size</p>
    </div>
    <div>
      <h2>0</h2>
      <p>Dependencies</p>
    </div>
    <div>
      <h2>4.2k</h2>
      <p>GitHub stars</p>
    </div>
    <div>
      <h2>v3.1</h2>
      <p>Latest release</p>
    </div>
  </div>

  <div class="cta">
    <a class="btn" href="https://github.com">Source Code</a>
    <a class="btn" href="#">Read the Docs</a>
  </div>

  <div class="footer">Gridlock / MIT License / 2026 / Built with HTML. Nothing else needed.</div>
</body>
</html>

```


## Instructions
You are providing an independent second opinion. Be critical and thorough.
- Analyze the question in the context provided
- Identify risks, tradeoffs, and blind spots
- Suggest alternatives if you see better approaches
- Be direct and opinionated — don't hedge
- Structure your response with clear headings
- Keep your response focused and actionable
