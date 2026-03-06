import fs from 'fs';
import path from 'path';
import { validateSkillFile as validateSkill } from '../lib/spec-validator.js';
import { visionAnalysis } from '../lib/openrouter.js';
import type { PipelineContext } from '../lib/types.js';

export default async function validate(context: PipelineContext): Promise<void> {
  console.log('[validate] Running final validation...');

  // Spec validation
  const result = validateSkill(context.skillPath);
  if (result.errors.length) {
    console.error(`[validate] Spec errors: ${result.errors.join(', ')}`);
  }
  if (result.warnings.length) {
    console.warn(`[validate] Spec warnings: ${result.warnings.join(', ')}`);
  }

  // Vision consistency check
  const screenshots = fs.readdirSync(context.screenshotsDir)
    .filter(f => f.endsWith('.png'))
    .slice(0, 3)
    .map(f => path.join(context.screenshotsDir, f));

  if (screenshots.length > 0) {
    const skill = fs.readFileSync(context.skillPath, 'utf-8');
    const response = await visionAnalysis({
      prompt: `Compare these screenshots against the design skill file below. Rate visual consistency on a scale of 1-10 and list any major discrepancies.

<skill>
${skill}
</skill>

Return JSON: { "score": number, "discrepancies": ["string"] }`,
      imagePaths: screenshots,
      maxTokens: 2048,
    });
    console.log(`[validate] Vision check result: ${response.slice(0, 200)}`);
  }

  const status = result.valid ? 'PASS' : 'FAIL';
  console.log(`[validate] Final status: ${status} (${result.errors.length} errors, ${result.warnings.length} warnings)`);

  if (!result.valid) {
    context.state.errors.push(...result.errors);
  }
}
