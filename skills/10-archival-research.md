# Design Skill: Archival Research

## Philosophy
The interface as a scholarly tool. Inspired by Wikipedia, Are.na, archive.org, and academic databases. Information density is a feature, not a bug. The design serves readers who want to navigate, cross-reference, and explore. Everything is plainly labeled. Links are abundant. The visual language borrows from library catalogs, footnotes, and card indexes. It's utilitarian but elegant in its commitment to access.

## The "No" List
- NO hero sections with large headlines (scholarly documents lead with titles, not billboards)
- NO decorative imagery (images must be figures with captions, never ornamental)
- NO more than 2 colors beyond black/white (restraint signals credibility in academic contexts)
- NO large font sizes — max heading: 1.5rem (dense information needs compact typography)
- NO marketing language or CTAs (the reader is a researcher, not a customer)
- NO rounded corners beyond 4px (sharp edges match the utilitarian, document-first aesthetic)
- NO animations or transitions (scholarly interfaces feel instant and mechanical, not performative)
- NO full-width layouts — content stays narrow at 680px max (optimal reading width for sustained study)
- NO custom cursors or fancy hover states (decoration distracts from the text itself)
- NO heavy font weights for body text (body at 400; only headings and metadata labels use 600)

## Design Tokens

### Colors
- `--bg`: #FAFAFA
- `--fg`: #222222
- `--link`: #1A5276 (scholarly blue)
- `--muted`: #777777
- `--border`: #DDDDDD
- `--highlight`: #FFF9C4 (yellow highlight, for emphasis)
- `--surface`: #F0F0F0
- Usage: 90% neutral, 8% text/link, 2% highlight

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400&display=swap');

body {
  font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  font-size: 15px;
  line-height: 1.75;
  font-weight: 400;
  color: #222;
}

h1, h2, h3 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  line-height: 1.3;
}

h1 { font-size: 1.5rem; }
h2 { font-size: 1.2rem; }
h3 { font-size: 1rem; }

code, .mono {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85em;
}
```

### Spacing
- Base unit: 4px
- Tight line spacing for dense content
- Margins: 16-32px between sections
- Max content width: 680px (optimal reading width)
- Sidebar (if used): 200-240px

## CSS Enforcers
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #FAFAFA;
  color: #222;
}

a {
  color: #1A5276;
  text-decoration: underline;
}

a:hover {
  color: #0D3B5A;
}

a:visited {
  color: #6B4C8A;
}

img {
  max-width: 100%;
  display: block;
}
```

## Signature Moves

### Table of contents sidebar
```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 48px;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px;
}

.toc {
  position: sticky;
  top: 32px;
  font-size: 0.8rem;
  line-height: 2;
}

.toc a {
  display: block;
  color: #777;
  text-decoration: none;
}

.toc a:hover,
.toc a.active {
  color: #222;
}
```

### Footnote-style references
```css
.footnote-ref {
  font-size: 0.7em;
  vertical-align: super;
  color: #1A5276;
  text-decoration: none;
  margin-left: 1px;
}

.footnotes {
  border-top: 1px solid #DDD;
  margin-top: 48px;
  padding-top: 16px;
  font-size: 0.85rem;
  color: #777;
}

.footnotes li {
  margin-bottom: 8px;
}
```

### Metadata block
```css
.metadata {
  font-size: 0.8rem;
  color: #777;
  border-left: 3px solid #DDD;
  padding-left: 12px;
  margin: 24px 0;
}

.metadata dt {
  font-weight: 600;
  color: #222;
  display: inline;
}

.metadata dd {
  display: inline;
  margin: 0;
}

.metadata dd::after {
  content: '';
  display: block;
}
```

### Highlighted passage
```css
.highlight {
  background: #FFF9C4;
  padding: 2px 4px;
}
```

### Dense link list
```css
.index-list {
  column-count: 2;
  column-gap: 32px;
  font-size: 0.85rem;
  line-height: 1.8;
}

.index-list a {
  display: block;
}
```

## Motion & Interaction
- **Transition duration range:** 0ms — no easing, no transitions. State changes are instant, like clicking a hyperlink in 1998.
- **Hover states:** links darken to #0D3B5A (color change only, no transform or underline animation). TOC links shift from #777 to #222. No hover effects on cards or containers.
- **Focus states:** 2px solid #1A5276 outline, 1px offset — plain and functional, matches link color
- **Page load:** immediate render, no entrance animations. Content appears fully formed.
- **`prefers-reduced-motion`:** no changes needed — the style uses no motion by default

## Component Patterns
- **Buttons:** this style avoids buttons. Use underlined text links instead. If a button is unavoidable: `background: none; border: 1px solid #DDD; padding: 6px 12px; font-family: inherit; font-size: 0.85rem; color: #1A5276; cursor: pointer`. No border-radius beyond 2px.
- **Cards:** no shadow, no border-radius. Use `background: #F0F0F0; padding: 16px; font-size: 0.85rem` for related-content boxes. Or use `border-left: 3px solid #DDD` metadata blocks instead of cards.
- **Navigation:** TOC sidebar (sticky, 200px, `font-size: 0.8rem; line-height: 2`). Links undecorated in muted gray, darken on hover. Horizontal nav is secondary — plain text links separated by middots.
- **Forms:** `border: 1px solid #DDD; padding: 6px 8px; font-family: inherit; font-size: 0.85rem; background: #FFF`. Labels above inputs in 0.8rem muted text. No floating labels or placeholder-as-label patterns.

## Accessibility
- **Color contrast:** `--fg` (#222) on `--bg` (#FAFAFA) = 15.4:1 ✓. `--link` (#1A5276) on `--bg` (#FAFAFA) = 8.2:1 ✓. `--muted` (#777) on `--bg` (#FAFAFA) = 4.5:1 ✓ (AA minimum). Highlight (#FFF9C4) background with #222 text = 14.1:1 ✓.
- **Focus indicators:** 2px solid #1A5276 outline — 8.2:1 contrast against #FAFAFA
- **Semantic HTML:** require `<nav>` (TOC), `<main>`, `<article>`, `<aside>`, `<footer>`. Use `<ol>` for footnotes, `<dl>` for metadata.
- **Touch targets:** inline links rely on line-height (1.75 * 15px = 26px) — acceptable for text-heavy scholarly content. TOC links at line-height 2 = 30px; add padding to reach 44px on touch devices.
- **`prefers-reduced-motion`:** no action required — style uses zero animation
- **Font sizing:** 15px body base, all headings in rem, footnotes no smaller than 0.8rem (12px)

## Responsive Behavior
- Collapse sidebar TOC to top-of-page on screens below 768px
- Maintain narrow content width (680px max) at all sizes
- Keep footnotes and metadata blocks functional on mobile

## DO List
- DO use a table-of-contents sidebar for longer pages
- DO use footnote-style references with superscript links
- DO use metadata blocks (border-left, small text) for document info
- DO use underlined links for all inline body text links
- DO use dense, multi-column link lists for index/archive pages

## Anti-patterns
- Do NOT add visual flair or decorative design
- Do NOT use large typography or bold headlines
- Do NOT add marketing-style hero sections
- Do NOT use cards with shadows or borders
- Do NOT remove underlines from inline body links (navigation and TOC links may omit underlines)
- Do NOT sacrifice information density for aesthetics
- Do NOT use icon libraries — plain text labels are better

## Reference Snippet
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Research Archive</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400&display=swap');
    * { box-sizing: border-box; margin: 0; }
    body { font-family: 'Source Serif 4', Georgia, serif; font-size: 15px; line-height: 1.75; color: #222; background: #FAFAFA; }
    a { color: #1A5276; } a:visited { color: #6B4C8A; } a:hover { color: #0D3B5A; }
    .layout { display: grid; grid-template-columns: 180px 1fr; gap: 40px; max-width: 880px; margin: 0 auto; padding: 32px; }
    .toc { position: sticky; top: 32px; font-size: 0.8rem; line-height: 2.2; }
    .toc-label { font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #777; margin-bottom: 4px; }
    .toc a { display: block; color: #777; text-decoration: none; } .toc a:hover { color: #222; }
    .content h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 4px; }
    .meta { font-size: 0.8rem; color: #777; margin-bottom: 24px; }
    .content h2 { font-size: 1.1rem; font-weight: 600; margin-top: 32px; margin-bottom: 8px; border-bottom: 1px solid #DDD; padding-bottom: 4px; }
    .content p { margin-bottom: 16px; }
    .content p + p { text-indent: 1.5em; margin-top: 0; }
    sup a { font-size: 0.7em; color: #1A5276; text-decoration: none; }
    .highlight { background: #FFF9C4; padding: 1px 3px; }
    .footnotes { border-top: 1px solid #DDD; margin-top: 40px; padding-top: 12px; font-size: 0.8rem; color: #777; }
    .footnotes ol { padding-left: 20px; }
    .footnotes li { margin-bottom: 6px; }
    .related { margin-top: 32px; padding: 16px; background: #F0F0F0; font-size: 0.85rem; }
    .related h3 { font-size: 0.9rem; margin-bottom: 8px; }
    .related ul { padding-left: 20px; }
    .related li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="toc">
      <div class="toc-label">Contents</div>
      <a href="#intro">Introduction</a>
      <a href="#method">Methodology</a>
      <a href="#findings">Findings</a>
      <a href="#refs">References</a>
    </aside>
    <main class="content">
      <h1>On the Structure of Vernacular Knowledge Systems</h1>
      <div class="meta">Published 2026-03-06 &middot; Last edited 2026-03-06 &middot; <a href="#">Edit</a> &middot; <a href="#">History</a></div>

      <h2 id="intro">Introduction</h2>
      <p>This document examines the organizational patterns found in informal knowledge archives, with particular attention to <span class="highlight">cross-referencing mechanisms</span> that emerge without central coordination.<sup><a href="#fn1">1</a></sup></p>
      <p>The study draws on comparative analysis of community-maintained databases, personal wikis, and annotated bookmark collections gathered between 2020 and 2025.</p>

      <h2 id="method">Methodology</h2>
      <p>We surveyed 142 independently maintained knowledge bases across three categories: personal research archives, community wikis, and curated link collections.<sup><a href="#fn2">2</a></sup></p>

      <h2 id="findings">Findings</h2>
      <p>Consistent patterns emerged in how contributors organized information without formal ontologies. The most common structure was a flat namespace with bidirectional links, similar to the approach described by Bush (1945) in his memex proposal.</p>

      <div class="related">
        <h3>Related entries</h3>
        <ul>
          <li><a href="#">Memex and the origins of hypertext</a></li>
          <li><a href="#">Zettelkasten method</a></li>
          <li><a href="#">Folksonomy vs. taxonomy in digital archives</a></li>
        </ul>
      </div>

      <div class="footnotes">
        <ol>
          <li id="fn1">Nelson, T. (1965). "Complex information processing: a file structure for the complex, the changing and the indeterminate."</li>
          <li id="fn2">Survey conducted via open call on Are.na and research-focused Discord communities.</li>
        </ol>
      </div>
    </main>
  </div>
</body>
</html>
```
