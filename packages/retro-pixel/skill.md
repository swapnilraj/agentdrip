# Design Skill: Retro Pixel

## Philosophy
The 8-bit and 16-bit era brought to the web. Inspired by Game Boy, NES, early Mac OS, and DOS interfaces. Everything is built on a visible pixel grid. Colors are limited like a hardware palette. Interfaces reference windowed operating systems and game UIs. The aesthetic is playful, constrained, and chunky. Pixels are never anti-aliased — they are celebrated.

## The "No" List
- NO anti-aliased text rendering (smooth fonts destroy the pixel grid — the crunch is the point)
- NO smooth gradients (real hardware couldn't render them; use hard color stops or dithering patterns)
- NO photography or photorealistic images (pixel art only — photos break the 8-bit illusion)
- NO border-radius (except 0) (rounded corners didn't exist on 1-bit displays)
- NO font sizes below 10px (pixel fonts become unreadable mush below this threshold)
- NO modern UI patterns like hamburger menus or shadow cards (these betray the retro OS window paradigm)
- NO opacity or transparency (old hardware had no alpha channel — everything is solid)
- NO CSS transitions or smooth animations (movement must use `step()` timing to match frame-by-frame rendering)
- NO more than 8 colors per palette (hardware palette limits are the creative constraint)

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

## Motion & Interaction
- **Transition duration:** 0ms — no easing, no tweening. All state changes are instant, like flipping a sprite frame.
- **Hover states:** full background color swap (e.g., `background: #6ABE30; color: #1A1A2E`). No partial effects — the entire element toggles like a selected menu item.
- **Focus states:** 4px solid `#FBF236` outline, no offset — chunky and unmissable, like a selection cursor.
- **Page load:** no entrance animations. Content appears instantly as if the ROM loaded. Optional: a blinking cursor element using `step-end`.
- **`prefers-reduced-motion`:** disable the blink animation. All other interactions are already instant, so no further changes needed.

## Component Patterns
- **Buttons:** beveled 3D look using asymmetric `border-color` (light top-left `#8B9EFF`, dark bottom-right `#3344AA`). On `:active`, border colors invert to simulate a press. `Press Start 2P` at 10px, padding `8px 16px`. No hover color change — press is the only feedback.
- **Cards:** use the OS-window pattern instead of cards. Each content block is a `.os-window` with a colored title bar (`#5B6EE1`), 4px solid border, and dark body (`#1A1A2E`). No shadows, no rounded corners.
- **Navigation:** vertical menu inside an OS window. Each link is a block element prefixed with `>`. Hover fills the entire row with `#6ABE30` background and `#1A1A2E` text. Active item uses `#FBF236` text.
- **Forms:** inputs have 3px inset borders (dark top-left, light bottom-right — opposite of buttons). Background `#1A1A2E`, text `#E8E8D0`. Labels in `Press Start 2P` at 10px above the field. No placeholder text — use a blinking cursor inside.

## Accessibility
- **Color contrast:** `--fg` (#E8E8D0) on `--bg` (#2B2B3D) is 8.2:1 — passes WCAG AAA. `--green` (#6ABE30) on `--dark` (#1A1A2E) is 5.8:1 — passes AA. `--yellow` (#FBF236) on `--bg` is 10.1:1.
- **Focus indicators:** 4px solid `#FBF236` outline; #FBF236 on `#2B2B3D` exceeds 3:1 for adjacent-color contrast.
- **Semantic HTML:** use `<nav>` for menu windows, `<main>` for primary content window, `<article>` for news items, `<footer>` for visitor counter.
- **Touch targets:** buttons and menu links must be at least 44px tall — pixel padding of `12px 16px` minimum on interactive elements.
- **`prefers-reduced-motion`:** disable blink/cursor animations (cross-ref Motion section). Instant state changes remain since they involve no motion.
- **Font sizing:** VT323 body at 20px. Press Start 2P headings at 10px+ are legible due to the font's high x-height, but never go below 10px.

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
