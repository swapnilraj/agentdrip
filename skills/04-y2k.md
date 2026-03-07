# Design Skill: Y2K Aesthetic

## Philosophy
The internet as a frontier — chaotic, glossy, and optimistic. Y2K design celebrates the late-90s/early-2000s digital excess: chrome gradients, bubble shapes, pixelated textures, and the thrill of new technology. It's the visual language of AIM, early Flash sites, and Windows XP. Futuristic yet nostalgic. Sleek yet kitschy. Everything glows.

## The "No" List
- NO flat design — everything needs depth, gloss, or texture (flatness kills the 3D chrome illusion)
- NO modern sans-serif fonts like Inter, SF Pro, etc. (they scream 2020s, not 2000s)
- NO clean minimalism (minimalism is the antithesis of Y2K excess)
- NO muted earthy tones (the palette is neon and chrome, not nature)
- NO large whitespace areas (empty space feels broken, not intentional — fill it with stars or gradients)
- NO CSS grid for main layouts (use flexbox styled to look era-appropriate; grid feels too modern/clean)
- NO subtle anything — Y2K is maximal (if it doesn't glow, bevel, or scroll, it doesn't belong)
- NO responsive-first thinking — design for a fixed 800-1024px width (era-authentic sites were fixed-width)

## Design Tokens

### Colors
- `--bg`: #1A0A2E (deep purple/black)
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

## Motion & Interaction
- Transitions: 150-250ms ease-in-out — snappy and electric, like clicking through a Flash site
- Hover: buttons invert gradient + glow pulse; links gain text-shadow 0 0 8px currentColor
- Focus: 2px solid #00CCFF outline with neon glow (box-shadow: 0 0 6px #00CCFF) — unmissable and on-brand
- Page load: marquee starts scrolling immediately; headings can flash/pulse once on entrance
- `prefers-reduced-motion`: stop marquee animation, disable glow pulses, keep static gradients and borders

## Component Patterns
- **Buttons**: beveled 3D style — background linear-gradient(to bottom, #555, #222), border 2px solid with border-color #777 #333 #333 #777, color #00CCFF, padding 8px 24px, font-family 'VT323', text-transform uppercase. Hover: gradient lightens, color #FFF. Ghost variant: transparent bg, border-color #00CCFF, color #00CCFF.
- **Cards**: use the beveled window container pattern — .window with title bar (linear-gradient blue), beveled border, dark purple body (#2A1A4E), padding 16px. No border-radius.
- **Navigation**: links styled as terminal commands with ">" prefix, color #00FF66, no underline. Active: text-shadow glow. Wrap nav in a .window panel for chrome framing.
- **Forms**: input background #0A0015, border 1px solid #00CCFF, color #FFF, padding 8px 12px, font-family 'VT323'. Label color #AAAACC, text-transform uppercase, font-size 12px. Focus: box-shadow 0 0 8px #00CCFF.

## Accessibility
- Color contrast: #FFFFFF on #1A0A2E = 15.4:1 (passes AAA). #AAAACC on #1A0A2E = 6.8:1 (passes AA). #00CCFF on #1A0A2E = 8.6:1 (passes AA)
- Focus indicators: 2px solid #00CCFF + box-shadow glow — highly visible against dark backgrounds, exceeds 3:1 contrast
- Semantic HTML: use nav, main, article, footer landmarks despite the retro visual aesthetic
- Touch targets: buttons minimum 44x44px; beveled style naturally provides generous hit areas via padding
- `prefers-reduced-motion`: disable marquee scroll, glow pulse animations; keep static neon text-shadow and gradients (see Motion section)
- Body text 16px minimum with 'VT323'; ensure pixel font remains legible at that size

## Responsive Behavior
- Design for fixed 800-960px width — center on larger screens
- On mobile (<768px), stack window panels vertically but maintain chrome/borders
- Marquee and starfield effects should work at any width

## DO List
- DO use window chrome (title bars, beveled borders) on content panels
- DO use neon text-shadow glow on headings
- DO include at least one scrolling marquee element
- DO use the starfield or dark textured background
- DO use beveled/3D border styles on buttons and panels

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
