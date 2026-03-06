import fs from 'fs';
import { chatCompletion } from '../lib/openrouter.js';
import { validateSkillFile as validateSkill } from '../lib/spec-validator.js';
import type { PipelineContext, ReviewIssue } from '../lib/types.js';
import generatePages from './generate-pages.js';
import screenshot from './screenshot.js';

export default async function refine(context: PipelineContext): Promise<void> {
  console.log('[refine] Refining skill based on review feedback...');

  const issues: ReviewIssue[] = (context.state as any).reviewIssues || [];

  if (issues.length === 0) {
    console.log('[refine] No issues to fix, skipping refinement');
    return;
  }

  const currentSkill = fs.readFileSync(context.skillPath, 'utf-8');

  const prompt = `Here is a design skill file that needs refinement based on review feedback.

<current-skill>
${currentSkill}
</current-skill>

<issues>
${JSON.stringify(issues, null, 2)}
</issues>

Fix all critical and warning issues. For suggestions, apply them if they improve quality.
Return the complete updated skill file. Do not wrap in code fences.`;

  const result = await chatCompletion({
    messages: [{ role: 'user', content: prompt }],
    maxTokens: 8192,
    temperature: 0.5,
  });

  // Strip markdown code fences if wrapped
  let content = result;
  const fenceMatch = content.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)```\s*$/);
  if (fenceMatch) content = fenceMatch[1];

  fs.writeFileSync(context.skillPath, content);

  const validation = validateSkill(context.skillPath);
  if (!validation.valid) {
    console.warn(`[refine] Refined skill has validation errors: ${validation.errors.join(', ')}`);
  }

  // Regenerate pages and screenshots with refined skill
  console.log('[refine] Regenerating pages and screenshots...');
  await generatePages(context);
  await screenshot(context);

  console.log('[refine] Refinement complete');
}
