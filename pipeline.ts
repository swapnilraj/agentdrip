#!/usr/bin/env npx tsx
import fs from 'fs';
import path from 'path';
import { PipelineContext, PipelineState, STEPS, StepName } from './lib/types.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const STATE_FILE = path.join(ROOT, 'pipeline-state.json');

function parseArgs(): { style: string; urls: string[]; resume: boolean; skipCollect: boolean; corpus?: string } {
  const args = process.argv.slice(2);
  let style = '';
  let urls: string[] = [];
  let resume = false;
  let skipCollect = false;
  let corpus: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--style' && args[i + 1]) style = args[++i];
    else if (args[i] === '--urls' && args[i + 1]) urls = args[++i].split(',').map(u => u.trim()).filter(Boolean);
    else if (args[i] === '--resume') resume = true;
    else if (args[i] === '--skip-collect') skipCollect = true;
    else if (args[i] === '--corpus' && args[i + 1]) corpus = args[++i];
  }

  if (!style) {
    console.error('Usage: npx tsx pipeline.ts --style "art-deco" [--urls "url1,url2"] [--resume] [--skip-collect --corpus path/]');
    process.exit(1);
  }

  return { style, urls, resume, skipCollect, corpus };
}

function buildContext(opts: ReturnType<typeof parseArgs>): PipelineContext {
  const slug = opts.style.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  // Determine next skill number
  const existingSkills = fs.readdirSync(path.join(ROOT, 'skills')).filter(f => f.endsWith('.md'));
  const maxNum = existingSkills.reduce((max, f) => {
    const m = f.match(/^(\d+)-/);
    return m ? Math.max(max, parseInt(m[1])) : max;
  }, 0);
  const num = String(maxNum + 1).padStart(2, '0');

  return {
    style: opts.style,
    urls: opts.urls,
    corpusDir: opts.corpus || path.join(ROOT, 'corpus', `${num}-${slug}`),
    skillPath: path.join(ROOT, 'skills', `${num}-${slug}.md`),
    testPagesDir: path.join(ROOT, 'test-pages'),
    screenshotsDir: path.join(ROOT, 'screenshots'),
    state: {
      currentStep: 'collect',
      completedSteps: [],
      skillGenAttempts: 0,
      pageGenAttempts: 0,
      reviewIterations: 0,
      errors: [],
    },
  };
}

function saveState(ctx: PipelineContext) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(ctx, null, 2));
}

function loadState(): PipelineContext | null {
  if (!fs.existsSync(STATE_FILE)) return null;
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
}

async function runStep(name: StepName, ctx: PipelineContext) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  STEP: ${name}`);
  console.log(`${'='.repeat(60)}\n`);

  ctx.state.currentStep = name;
  saveState(ctx);

  const mod = await import(`./steps/${name}.js`);
  await mod.default(ctx);

  ctx.state.completedSteps.push(name);
  saveState(ctx);
  console.log(`\n  [done] ${name}\n`);
}

async function main() {
  const opts = parseArgs();
  let ctx: PipelineContext;

  if (opts.resume) {
    const saved = loadState();
    if (!saved) {
      console.error('No pipeline-state.json found. Cannot resume.');
      process.exit(1);
    }
    ctx = saved;
    console.log(`Resuming from step: ${ctx.state.currentStep}`);
  } else {
    ctx = buildContext(opts);
  }

  // Ensure directories exist
  fs.mkdirSync(ctx.corpusDir, { recursive: true });
  fs.mkdirSync(ctx.testPagesDir, { recursive: true });
  fs.mkdirSync(ctx.screenshotsDir, { recursive: true });

  // Determine which steps to run
  const startIdx = opts.resume
    ? STEPS.indexOf(ctx.state.currentStep as StepName)
    : opts.skipCollect ? 1 : 0;

  for (let i = startIdx; i < STEPS.length; i++) {
    const step = STEPS[i];
    try {
      await runStep(step, ctx);
    } catch (err: any) {
      console.error(`\n  [ERROR] Step "${step}" failed: ${err.message}`);
      ctx.state.errors.push(`${step}: ${err.message}`);
      saveState(ctx);

      // Don't hard-fail on review/refine — continue with warning
      if (step === 'review' || step === 'refine') {
        console.log(`  [warn] Continuing despite ${step} failure...`);
        ctx.state.completedSteps.push(step);
        continue;
      }
      process.exit(1);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  PIPELINE COMPLETE');
  console.log('='.repeat(60));
  console.log(`  Skill: ${ctx.skillPath}`);
  console.log(`  Pages: ${ctx.testPagesDir}`);
  console.log(`  Screenshots: ${ctx.screenshotsDir}`);
  if (ctx.state.errors.length) {
    console.log(`  Warnings: ${ctx.state.errors.length}`);
    ctx.state.errors.forEach(e => console.log(`    - ${e}`));
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
