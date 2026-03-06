import fs from 'fs';
import path from 'path';
import { chatCompletion } from '../lib/openrouter.js';
import type { PipelineContext } from '../lib/types.js';

const PAGE_TYPES = ['landing', 'portfolio', 'blog'] as const;

export default async function generatePages(context: PipelineContext): Promise<void> {
  console.log('[generate-pages] Generating test pages...');

  const skill = fs.readFileSync(context.skillPath, 'utf-8');
  fs.mkdirSync(context.testPagesDir, { recursive: true });

  // Derive number from skill filename or default to 11
  const skillBasename = path.basename(context.skillPath);
  const numMatch = skillBasename.match(/^(\d+)/);
  const num = numMatch ? numMatch[1] : '11';

  const style = context.style;

  const pages = await Promise.all(PAGE_TYPES.map(async (pageType) => {
    const prompt = `Generate a complete, standalone HTML page for a ${pageType} page in the "${style}" visual style.

<skill-file>
${skill}
</skill-file>

Requirements:
- Single HTML file with all CSS inlined in a <style> tag
- No external dependencies (no CDN links, no external fonts unless from Google Fonts)
- Realistic placeholder content (not lorem ipsum)
- Fully responsive
- Must faithfully follow the design tokens, CSS enforcers, and signature moves from the skill file
- Include enough content to fill a full page

Return ONLY the HTML, no explanation.`;

    const result = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 8192,
      temperature: 0.7,
    });

    // Extract HTML from code fence if present
    let html = result;
    const fenceMatch = html.match(/```(?:html)?\s*\n([\s\S]*?)```/);
    if (fenceMatch) html = fenceMatch[1];

    const filename = `${num}-${style}-${pageType}.html`;
    const filePath = path.join(context.testPagesDir, filename);
    fs.writeFileSync(filePath, html);
    console.log(`  [generate-pages] Wrote ${filename}`);
    return filePath;
  }));

  context.state.pageGenAttempts++;
  console.log(`[generate-pages] Generated ${pages.length} pages`);
}
