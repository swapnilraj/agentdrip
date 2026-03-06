import fs from 'fs';
import path from 'path';
import { visionAnalysis } from '../lib/openrouter.js';
import type { PipelineContext, DesignAnalysis } from '../lib/types.js';

function extractJson(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return text.trim();
}

export default async function analyze(context: PipelineContext): Promise<void> {
  console.log('[analyze] Analyzing corpus images...');

  const files = fs.readdirSync(context.corpusDir)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .slice(0, 10)
    .map(f => path.join(context.corpusDir, f));

  if (files.length === 0) {
    throw new Error('No images found in corpus directory');
  }

  const prompt = `Analyze these ${files.length} design reference images for the "${context.style}" visual style.
Return a JSON object matching this exact structure (no extra keys):
{
  "colors": [{ "name": "string", "hex": "#RRGGBB", "usage": "string" }],
  "typography": [{ "element": "string", "family": "string", "size": "string", "weight": "string", "lineHeight": "string" }],
  "spacing": { "baseUnit": "string", "maxWidth": "string", "sectionSpacing": "string" },
  "layout": ["string"],
  "philosophy": "string",
  "signatureTechniques": ["string"]
}

Be specific about hex colors, font families, and pixel/rem sizes. Include at least 5 colors and 4 typography entries.`;

  const response = await visionAnalysis({
    prompt,
    imagePaths: files,
    maxTokens: 4096,
  });

  const jsonStr = extractJson(response);
  const analysis: DesignAnalysis = JSON.parse(jsonStr);
  context.state.analysis = analysis;
  console.log(`[analyze] Extracted ${analysis.colors.length} colors, ${analysis.typography.length} typography rules, ${analysis.signatureTechniques.length} techniques`);
}
