module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},75868,a=>{a.n(a.i(37271))},21752,a=>{a.n(a.i(12632))},24128,a=>{a.n(a.i(89664))},8532,a=>{a.n(a.i(62647))},50918,a=>{a.n(a.i(58781))},73045,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},66990,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(261);a.n(d("[project]/web/node_modules/next/dist/client/app-dir/link.js <module evaluation>"))},52470,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(261);a.n(d("[project]/web/node_modules/next/dist/client/app-dir/link.js"))},19286,a=>{"use strict";a.i(66990);var b=a.i(52470);a.n(b)},3184,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={default:function(){return i},useLinkStatus:function(){return h.useLinkStatus}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(73045),g=a.r(80516),h=f._(a.r(19286));function i(a){let b=a.legacyBehavior,c="string"==typeof a.children||"number"==typeof a.children||"string"==typeof a.children?.type,d=a.children?.type?.$$typeof===Symbol.for("react.client.reference");return!b||c||d||(a.children?.type?.$$typeof===Symbol.for("react.lazy")?console.error("Using a Lazy Component as a direct child of `<Link legacyBehavior>` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's `<a>` tag."):console.error("Using a Server Component as a direct child of `<Link legacyBehavior>` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's `<a>` tag.")),(0,g.jsx)(h.default,{...a})}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},91378,a=>{"use strict";var b=a.i(80516),c=a.i(3184);function d(){return(0,b.jsxs)("div",{className:"max-w-2xl mx-auto px-6 py-16",children:[(0,b.jsx)("h1",{className:"text-3xl font-bold mb-2",children:"Publish a Style"}),(0,b.jsxs)("p",{className:"text-neutral-400 mb-8",children:["Design skills are published as npm packages under the"," ",(0,b.jsx)("code",{className:"text-purple-400",children:"@agentdrip"})," scope (or your own scope)."]}),(0,b.jsxs)("div",{className:"space-y-8",children:[(0,b.jsxs)("section",{children:[(0,b.jsx)("h2",{className:"text-xl font-semibold mb-4",children:"1. Scaffold your package"}),(0,b.jsx)("pre",{className:"p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono",children:`mkdir my-style && cd my-style
npm init -y`})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h2",{className:"text-xl font-semibold mb-4",children:"2. Add your files"}),(0,b.jsxs)("div",{className:"p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 font-mono",children:[(0,b.jsx)("div",{className:"text-neutral-500 mb-2",children:"Package structure:"}),`my-style/
├── package.json
├── skill.md          # Your design skill file
├── skin.css          # Website skin CSS
├── previews/
│   └── landing.html  # Preview page
└── README.md`]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h2",{className:"text-xl font-semibold mb-4",children:"3. Configure package.json"}),(0,b.jsx)("pre",{className:"p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono",children:`{
  "name": "@agentdrip/my-style",
  "version": "1.0.0",
  "description": "A brief description of your style",
  "keywords": ["agentdrip", "design-skill"],
  "agentdrip": {
    "type": "design-skill",
    "slug": "my-style",
    "displayName": "My Style",
    "philosophy": "One sentence about your design philosophy",
    "tags": ["modern", "clean", "minimal"],
    "colors": {
      "bg": "#FFFFFF",
      "fg": "#000000",
      "accent": "#6366F1"
    },
    "fonts": ["Inter"]
  },
  "files": ["skill.md", "skin.css", "previews/"]
}`})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h2",{className:"text-xl font-semibold mb-4",children:"4. Publish"}),(0,b.jsx)("pre",{className:"p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono",children:"npm publish --access public"}),(0,b.jsxs)("p",{className:"text-neutral-500 text-sm mt-3",children:["Your style will be automatically indexed and appear on AgentDrip within minutes. We discover packages by the ",(0,b.jsx)("code",{className:"text-neutral-400",children:"agentdrip"})," and"," ",(0,b.jsx)("code",{className:"text-neutral-400",children:"design-skill"})," keywords."]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h2",{className:"text-xl font-semibold mb-4",children:"5. Fork an existing style"}),(0,b.jsx)("pre",{className:"p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono",children:`# Install the style you want to fork
npm install @agentdrip/brutalist

# Copy its files to your package
cp node_modules/@agentdrip/brutalist/skill.md ./skill.md
cp node_modules/@agentdrip/brutalist/skin.css ./skin.css

# Modify and publish under your scope
npm publish --access public`})]}),(0,b.jsx)("div",{className:"pt-4 border-t border-neutral-800",children:(0,b.jsxs)("p",{className:"text-neutral-500 text-sm",children:["Need help writing a skill file?"," ",(0,b.jsx)(c.default,{href:"/browse",className:"text-purple-400 hover:text-purple-300",children:"Browse existing styles"})," ","for examples, or check the"," ",(0,b.jsx)("a",{href:"https://github.com/agentdrip/agentdrip",className:"text-purple-400 hover:text-purple-300",target:"_blank",rel:"noopener",children:"documentation"}),"."]})})]})]})}a.s(["default",()=>d])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0e5bc732._.js.map