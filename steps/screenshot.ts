import fs from 'fs';
import path from 'path';
import type { PipelineContext } from '../lib/types.js';

export default async function screenshot(context: PipelineContext): Promise<void> {
  console.log('[screenshot] Taking screenshots of test pages...');

  const { chromium } = await import('playwright');
  fs.mkdirSync(context.screenshotsDir, { recursive: true });

  const htmlFiles = fs.readdirSync(context.testPagesDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(context.testPagesDir, f));

  if (htmlFiles.length === 0) {
    console.warn('[screenshot] No HTML files found in test pages directory');
    return;
  }

  const browser = await chromium.launch({ headless: true });

  for (const htmlPath of htmlFiles) {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const basename = path.basename(htmlPath, '.html');
    const outputPath = path.join(context.screenshotsDir, `${basename}.png`);

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: outputPath, fullPage: false });
    await page.close();
    console.log(`  [screenshot] ${basename}.png`);
  }

  await browser.close();
  console.log(`[screenshot] Captured ${htmlFiles.length} screenshots`);
}
