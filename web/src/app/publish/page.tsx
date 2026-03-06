import Link from "next/link";

export default function PublishPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Publish a Style</h1>
      <p className="text-neutral-400 mb-8">
        Design skills are published as npm packages under the{" "}
        <code className="text-purple-400">@agentdrip</code> scope (or your own scope).
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Scaffold your package</h2>
          <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono">
{`mkdir my-style && cd my-style
npm init -y`}
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Add your files</h2>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 font-mono">
            <div className="text-neutral-500 mb-2">Package structure:</div>
{`my-style/
├── package.json
├── skill.md          # Your design skill file
├── skin.css          # Website skin CSS
├── previews/
│   └── landing.html  # Preview page
└── README.md`}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Configure package.json</h2>
          <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono">
{`{
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
}`}
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Publish</h2>
          <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono">
{`npm publish --access public`}
          </pre>
          <p className="text-neutral-500 text-sm mt-3">
            Your style will be automatically indexed and appear on AgentDrip within minutes.
            We discover packages by the <code className="text-neutral-400">agentdrip</code> and{" "}
            <code className="text-neutral-400">design-skill</code> keywords.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Fork an existing style</h2>
          <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto font-mono">
{`# Install the style you want to fork
npm install @agentdrip/brutalist

# Copy its files to your package
cp node_modules/@agentdrip/brutalist/skill.md ./skill.md
cp node_modules/@agentdrip/brutalist/skin.css ./skin.css

# Modify and publish under your scope
npm publish --access public`}
          </pre>
        </section>

        <div className="pt-4 border-t border-neutral-800">
          <p className="text-neutral-500 text-sm">
            Need help writing a skill file?{" "}
            <Link href="/browse" className="text-purple-400 hover:text-purple-300">
              Browse existing styles
            </Link>{" "}
            for examples, or check the{" "}
            <a
              href="https://github.com/agentdrip/agentdrip"
              className="text-purple-400 hover:text-purple-300"
              target="_blank"
              rel="noopener"
            >
              documentation
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
