import fs from 'fs';
import path from 'path';
import { chatCompletion } from '../lib/openrouter.js';
import { validateSkillFile as validateSkill } from '../lib/spec-validator.js';
import type { PipelineContext } from '../lib/types.js';

const SPEC_PATH = '/Users/swp/dev/swapnilraj/design-skill/SKILL-FORMAT-SPEC.md';
const EXAMPLE_PATHS = [
  '/Users/swp/dev/swapnilraj/design-skill/skills/01-brutalist.md',
  '/Users/swp/dev/swapnilraj/design-skill/skills/08-neo-brutalist.md',
];

export default async function generateSkill(context: PipelineContext): Promise<void> {
  console.log('[generate-skill] Generating skill file...');

  const spec = fs.readFileSync(SPEC_PATH, 'utf-8');
  const examples = EXAMPLE_PATHS.map(p => fs.readFileSync(p, 'utf-8'));
  const analysis = context.state.analysis;

  if (!analysis) throw new Error('No analysis found in state. Run analyze step first.');

  const systemPrompt = `You are a design system expert. Generate a design skill markdown file following this specification exactly:

<spec>
${spec}
</spec>

Here are two example skill files for reference:

<example1>
${examples[0]}
</example1>

<example2>
${examples[1]}
</example2>

Rules:
- Follow the section order from the spec precisely
- Each color token must have exactly ONE hex value
- The "No" list must not contradict Design Tokens or Signature Moves
- Include a substantial Reference Snippet with working HTML/CSS
- Be specific and opinionated, not generic`;

  const userPrompt = `Generate a complete design skill file for the "${context.style}" visual style.

Design analysis data:
${JSON.stringify(analysis, null, 2)}

The file should capture the essence of this style so that an AI can generate faithful HTML pages from it.`;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    context.state.skillGenAttempts = attempts;
    console.log(`  [generate-skill] Attempt ${attempts}/${maxAttempts}`);

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    if (attempts > 1) {
      const prevResult = validateSkill(context.skillPath);
      messages.push({
        role: 'user',
        content: `The previous attempt had validation errors. Fix these issues:\n${prevResult.errors.join('\n')}\n${prevResult.warnings.join('\n')}`,
      });
    }

    const result = await chatCompletion({ messages, maxTokens: 8192, temperature: 0.7 });

    // Strip markdown code fences if wrapped
    let content = result;
    const fenceMatch = content.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)```\s*$/);
    if (fenceMatch) content = fenceMatch[1];

    fs.mkdirSync(path.dirname(context.skillPath), { recursive: true });
    fs.writeFileSync(context.skillPath, content);

    const validation = validateSkill(context.skillPath);
    if (validation.valid) {
      console.log(`[generate-skill] Valid skill file generated on attempt ${attempts}`);
      if (validation.warnings.length) {
        console.log(`  Warnings: ${validation.warnings.join(', ')}`);
      }
      return;
    }

    console.warn(`  [generate-skill] Validation failed: ${validation.errors.join(', ')}`);
  }

  console.warn('[generate-skill] Max attempts reached, using last result');
}
