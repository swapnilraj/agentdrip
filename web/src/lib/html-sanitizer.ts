import sanitizeHtml from "sanitize-html";

const GOOGLE_FONTS_RE = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

const ALLOWED_TAGS = [
  "html", "head", "body", "style", "link", "meta", "title",
  "div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "a", "ul", "ol", "li", "img",
  "section", "article", "nav", "header", "footer", "main", "aside",
  "figure", "figcaption", "blockquote", "pre", "code", "em", "strong",
  "br", "hr",
  "table", "thead", "tbody", "tr", "th", "td",
  "svg", "circle", "rect", "line", "polyline", "polygon", "path", "g", "defs",
  "linearGradient", "radialGradient", "stop", "text", "tspan", "clipPath", "use",
];

export function sanitizeGeneratedHtml(raw: string): string {
  let cleaned = sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      "*": ["class", "id", "style", "role", "aria-*", "data-*"],
      "a": ["href", "target", "rel"],
      "img": ["src", "alt", "width", "height", "loading"],
      "link": ["rel", "href", "crossorigin"],
      "meta": ["charset", "name", "content", "viewport"],
      "svg": ["viewBox", "xmlns", "width", "height", "fill", "stroke"],
      "circle": ["cx", "cy", "r", "fill", "stroke", "stroke-width"],
      "rect": ["x", "y", "width", "height", "rx", "ry", "fill", "stroke"],
      "line": ["x1", "y1", "x2", "y2", "stroke", "stroke-width"],
      "polyline": ["points", "fill", "stroke"],
      "polygon": ["points", "fill", "stroke"],
      "path": ["d", "fill", "stroke", "stroke-width"],
      "g": ["transform", "fill", "stroke"],
      "linearGradient": ["id", "x1", "y1", "x2", "y2"],
      "radialGradient": ["id", "cx", "cy", "r", "fx", "fy"],
      "stop": ["offset", "stop-color", "stop-opacity"],
      "text": ["x", "y", "dx", "dy", "text-anchor", "font-size", "fill"],
      "tspan": ["x", "y", "dx", "dy"],
      "clipPath": ["id"],
      "use": ["href", "x", "y", "width", "height"],
    },
    allowedSchemes: ["https", "data"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    // Only allow data: on img src
    exclusiveFilter: (frame) => {
      // Strip img with non-data: src (except empty)
      if (frame.tag === "img" && frame.attribs.src) {
        const src = frame.attribs.src;
        if (!src.startsWith("data:")) return true;
      }
      // Strip link tags that aren't Google Fonts
      if (frame.tag === "link" && frame.attribs.href) {
        if (!GOOGLE_FONTS_RE.test(frame.attribs.href)) return true;
      }
      // Strip meta tags that aren't charset or viewport
      if (frame.tag === "meta") {
        const hasCharset = "charset" in frame.attribs;
        const isViewport = frame.attribs.name === "viewport";
        if (!hasCharset && !isViewport) return true;
      }
      return false;
    },
    // Strip all on* event handlers
    allowedStyles: {},
    transformTags: {
      "a": (tagName, attribs) => {
        // Strip javascript: URLs
        if (attribs.href && attribs.href.toLowerCase().trim().startsWith("javascript:")) {
          delete attribs.href;
        }
        return { tagName, attribs };
      },
    },
  });

  // Strip dangerous CSS: url() except Google Fonts
  cleaned = stripDangerousCss(cleaned);

  return cleaned;
}

function stripDangerousCss(html: string): string {
  // Process content inside <style> tags
  return html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css: string) => {
    let sanitizedCss = css;

    // Remove @import except Google Fonts
    sanitizedCss = sanitizedCss.replace(/@import\s+(?:url\s*\()?['"]?([^'"\s);]+)['"]?\)?[^;]*;/gi, (importMatch, url: string) => {
      if (GOOGLE_FONTS_RE.test(url)) return importMatch;
      return "/* stripped import */";
    });

    // Remove url() except Google Fonts
    sanitizedCss = sanitizedCss.replace(/url\s*\(\s*['"]?([^'"\s)]+)['"]?\s*\)/gi, (urlMatch, url: string) => {
      if (GOOGLE_FONTS_RE.test(url)) return urlMatch;
      return "/* stripped url */";
    });

    return `<style>${sanitizedCss}</style>`;
  });
}
