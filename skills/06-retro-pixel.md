# Design Skill: Retro Pixel

## Philosophy
The 8-bit and 16-bit era brought to the web. Inspired by Game Boy, NES, early Mac OS, and DOS interfaces. Everything is built on a visible pixel grid. Colors are limited like a hardware palette. Interfaces reference windowed operating systems and game UIs. The aesthetic is playful, constrained, and chunky. Pixels are never anti-aliased — they are celebrated.

## The "No" List
- NO anti-aliased text rendering (use pixel fonts)
- NO smooth gradients
- NO photography or photorealistic images
- NO border-radius (except 0)
- NO font sizes below 10px (keep pixels readable)
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

## Responsive Behavior
- Use fixed-width layout (640px) centered on screen — do not make fluid
- On screens narrower than 640px, allow horizontal scroll rather than reflowing
- Pixel grid alignment (8px multiples) must be preserved at all sizes

## DO List
- DO use OS-style window chrome (title bar, border) on content panels
- DO use the 8-color palette strictly — no additional colors
- DO use pixel-perfect 8px grid alignment for all spacing
- DO use Press Start 2P for headings and VT323 for body text
- DO include at least one blinking cursor or animation using step-end timing

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
