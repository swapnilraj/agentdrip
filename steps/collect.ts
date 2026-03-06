import fs from 'fs';
import path from 'path';
import type { PipelineContext } from '../lib/types.js';

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (e) {
    console.warn(`  [collect] failed to download ${url}: ${(e as Error).message}`);
    return false;
  }
}

async function collectArena(style: string, outDir: string): Promise<number> {
  const token = process.env.ARENA_ACCESS_TOKEN;
  if (!token) { console.warn('  [collect] ARENA_ACCESS_TOKEN not set, skipping Are.na'); return 0; }

  const res = await fetch(`https://api.are.na/v2/search/blocks?q=${encodeURIComponent(style)}&per=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { console.warn(`  [collect] Are.na API error: ${res.status}`); return 0; }
  const data = await res.json() as any;
  const blocks = (data.blocks || []).filter((b: any) => b.image?.display?.url);
  let count = 0;
  for (const block of blocks) {
    const url = block.image.display.url;
    const dest = path.join(outDir, `arena-${count}.png`);
    if (await downloadImage(url, dest)) count++;
  }
  return count;
}

async function collectUnsplash(style: string, outDir: string): Promise<number> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) { console.warn('  [collect] UNSPLASH_ACCESS_KEY not set, skipping Unsplash'); return 0; }

  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(style + ' web design')}&per_page=10`, {
    headers: { Authorization: `Client-ID ${key}` },
  });
  if (!res.ok) { console.warn(`  [collect] Unsplash API error: ${res.status}`); return 0; }
  const data = await res.json() as any;
  let count = 0;
  for (const photo of data.results || []) {
    const url = photo.urls?.regular;
    if (!url) continue;
    const dest = path.join(outDir, `unsplash-${count}.png`);
    if (await downloadImage(url, dest)) count++;
  }
  return count;
}

async function collectSerpApi(style: string, outDir: string): Promise<number> {
  const key = process.env.SERPAPI_KEY;
  if (!key) { console.warn('  [collect] SERPAPI_KEY not set, skipping SerpAPI'); return 0; }

  const res = await fetch(`https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(style + ' web design inspiration')}&api_key=${key}&num=10`);
  if (!res.ok) { console.warn(`  [collect] SerpAPI error: ${res.status}`); return 0; }
  const data = await res.json() as any;
  let count = 0;
  for (const img of data.images_results || []) {
    const url = img.original;
    if (!url) continue;
    const dest = path.join(outDir, `serp-${count}.png`);
    if (await downloadImage(url, dest)) count++;
  }
  return count;
}

async function collectUrls(urls: string[], outDir: string): Promise<number> {
  if (!urls.length) return 0;
  let chromium: any;
  try {
    chromium = (await import('playwright')).chromium;
  } catch {
    console.warn('  [collect] playwright not available, skipping URL screenshots');
    return 0;
  }

  const browser = await chromium.launch({ headless: true });
  let count = 0;
  for (const url of urls) {
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const dest = path.join(outDir, `url-${count}.png`);
      await page.screenshot({ path: dest, fullPage: false });
      await page.close();
      count++;
    } catch (e) {
      console.warn(`  [collect] failed to screenshot ${url}: ${(e as Error).message}`);
    }
  }
  await browser.close();
  return count;
}

export default async function collect(context: PipelineContext): Promise<void> {
  console.log(`[collect] Gathering corpus for style: ${context.style}`);
  fs.mkdirSync(context.corpusDir, { recursive: true });

  const [arena, unsplash, serp, urlCount] = await Promise.all([
    collectArena(context.style, context.corpusDir),
    collectUnsplash(context.style, context.corpusDir),
    collectSerpApi(context.style, context.corpusDir),
    collectUrls(context.urls, context.corpusDir),
  ]);

  const total = arena + unsplash + serp + urlCount;
  console.log(`[collect] Collected ${total} images (arena:${arena} unsplash:${unsplash} serp:${serp} urls:${urlCount})`);

  if (total === 0) {
    context.state.errors.push('No images collected from any source');
  }
}
