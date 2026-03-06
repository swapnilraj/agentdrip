import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

export async function chatCompletion(opts: {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string | Array<any> }>;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const model = opts.model || 'anthropic/claude-sonnet-4-6';
  console.log(`  [openrouter] calling ${model}...`);
  const response = await client.chat.completions.create({
    model,
    messages: opts.messages as any,
    max_tokens: opts.maxTokens || 4096,
    temperature: opts.temperature ?? 0.7,
  });
  return response.choices[0]?.message?.content || '';
}

export async function visionAnalysis(opts: {
  model?: string;
  prompt: string;
  imagePaths: string[];
  maxTokens?: number;
}): Promise<string> {
  const model = opts.model || 'anthropic/claude-sonnet-4-6';
  const content: any[] = [{ type: 'text', text: opts.prompt }];

  for (const imgPath of opts.imagePaths) {
    const data = fs.readFileSync(imgPath);
    const base64 = data.toString('base64');
    const ext = path.extname(imgPath).slice(1).toLowerCase();
    const mediaType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    content.push({
      type: 'image_url',
      image_url: { url: `data:${mediaType};base64,${base64}` },
    });
  }

  console.log(`  [openrouter] vision call with ${opts.imagePaths.length} images to ${model}...`);
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content }],
    max_tokens: opts.maxTokens || 4096,
  });
  return response.choices[0]?.message?.content || '';
}
