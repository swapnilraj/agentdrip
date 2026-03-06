import fs from 'fs';
import path from 'path';
import { chatCompletion } from '../lib/openrouter.js';
import type { PipelineContext, ReviewIssue } from '../lib/types.js';

function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return text.trim();
}

export default async function review(context: PipelineContext): Promise<void> {
  console.log('[review] Running multi-model review...');

  const skill = fs.readFileSync(context.skillPath, 'utf-8');

  const htmlFiles = fs.readdirSync(context.testPagesDir)
    .filter(f => f.endsWith('.html'))
    .slice(0, 3);
  const pages = htmlFiles.map(f => ({
    name: f,
    content: fs.readFileSync(path.join(context.testPagesDir, f), 'utf-8'),
  }));

  const prompt = `Review this design skill file and its generated HTML test pages for quality and consistency.

<skill>
${skill}
</skill>

${pages.map(p => `<page name="${p.name}">\n${p.content}\n</page>`).join('\n\n')}

Identify issues as a JSON array of objects with this structure:
[{ "severity": "critical"|"warning"|"suggestion", "section": "string", "description": "string" }]

Check for:
- Spec contradictions (e.g., "No" list contradicting tokens)
- Missing or weak sections
- Pages not faithfully following the skill's design tokens
- Generic or non-distinctive output
- Color/typography mismatches between skill and pages

Return ONLY the JSON array.`;

  const models = [
    'anthropic/claude-sonnet-4-6',
    'google/gemini-2.5-pro-preview-06-05',
  ];

  const results = await Promise.all(models.map(async (model) => {
    try {
      const response = await chatCompletion({
        model,
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 4096,
        temperature: 0.3,
      });
      const issues: ReviewIssue[] = JSON.parse(extractJson(response));
      return issues;
    } catch (e) {
      console.warn(`  [review] ${model} failed: ${(e as Error).message}`);
      return [];
    }
  }));

  // Merge and deduplicate
  const allIssues = results.flat();
  const seen = new Set<string>();
  const deduped: ReviewIssue[] = [];
  for (const issue of allIssues) {
    const key = `${issue.severity}:${issue.section}:${issue.description.slice(0, 50)}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(issue);
    }
  }

  (context.state as any).reviewIssues = deduped;
  context.state.reviewIterations++;
  console.log(`[review] Found ${deduped.length} issues (${deduped.filter(i => i.severity === 'critical').length} critical)`);
}
