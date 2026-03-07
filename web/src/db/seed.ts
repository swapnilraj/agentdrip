import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import fs from "fs";
import path from "path";
import * as schema from "./schema";
import { syncAllPackages } from "../lib/npm-indexer";
import { getEmbedding, buildEmbeddingText } from "../lib/embeddings";

const PACKAGES_DIR = "/Users/swp/dev/swapnilraj/design-skill/packages";

const dbPath = path.join(process.cwd(), "data", "agentdrip.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const client = createClient({ url: `file:${dbPath}` });
const db = drizzle(client, { schema });

async function resetDb() {
  await client.executeMultiple(`
    DROP TABLE IF EXISTS packages_fts;
    DROP TABLE IF EXISTS style_versions;
    DROP TABLE IF EXISTS style_pages;
    DROP TABLE IF EXISTS corpus_images;
    DROP TABLE IF EXISTS styles;
    DROP TABLE IF EXISTS packages;

    CREATE TABLE packages (
      name TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      version TEXT NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT,
      philosophy TEXT,
      author_name TEXT NOT NULL,
      tags TEXT,
      colors TEXT,
      fonts TEXT,
      thumbnail_url TEXT,
      npm_url TEXT NOT NULL,
      skill_content TEXT,
      skin_css TEXT,
      preview_html TEXT,
      last_synced_at TEXT NOT NULL,
      first_seen_at TEXT NOT NULL,
      weekly_downloads INTEGER DEFAULT 0,
      moodboard TEXT,
      embedding TEXT
    );

    CREATE VIRTUAL TABLE packages_fts USING fts5(
      slug,
      display_name,
      description,
      philosophy,
      tags,
      skill_excerpt,
      tokenize='porter unicode61'
    );
  `);
}

function buildFtsExcerpt(skillContent: string | null): string {
  if (!skillContent) return "";
  // Extract the most searchable parts: first 1500 chars covers
  // title, philosophy, design tokens, and signature moves
  return skillContent.slice(0, 1500);
}

async function seedFromLocal() {
  if (!fs.existsSync(PACKAGES_DIR)) {
    console.log(`No local packages directory at ${PACKAGES_DIR}`);
    return 0;
  }

  const dirs = fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const now = new Date().toISOString();
  let count = 0;
  const hasApiKey = !!process.env.OPENROUTER_API_KEY;

  for (const dir of dirs) {
    const pkgJsonPath = path.join(PACKAGES_DIR, dir, "package.json");
    if (!fs.existsSync(pkgJsonPath)) continue;

    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    const agentdrip = pkgJson.agentdrip || {};

    const readFile = (rel: string): string | null => {
      const p = path.join(PACKAGES_DIR, dir, rel);
      return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null;
    };

    const slug = agentdrip.slug ?? dir;
    const displayName = agentdrip.displayName ?? slug;
    const authorName =
      typeof pkgJson.author === "string"
        ? pkgJson.author
        : pkgJson.author?.name ?? "Unknown";
    const description = pkgJson.description ?? null;
    const philosophy = agentdrip.philosophy ?? null;
    const tags = agentdrip.tags ? JSON.stringify(agentdrip.tags) : null;
    const skillContent = readFile("skill.md");

    // Generate embedding if API key available
    let embedding: string | null = null;
    if (hasApiKey) {
      const text = buildEmbeddingText({ displayName, description, philosophy, tags, skillContent });
      const vec = await getEmbedding(text);
      if (vec) {
        embedding = JSON.stringify(vec);
        console.log(`  Generated embedding for ${slug} (${vec.length} dims)`);
      }
    }

    await db.insert(schema.packages).values({
      name: pkgJson.name ?? `@agentdrip/${dir}`,
      slug,
      version: pkgJson.version ?? "1.0.0",
      displayName,
      description,
      philosophy,
      authorName,
      tags,
      colors: agentdrip.colors ? JSON.stringify(agentdrip.colors) : null,
      fonts: agentdrip.fonts ? JSON.stringify(agentdrip.fonts) : null,
      thumbnailUrl: null,
      npmUrl: `https://www.npmjs.com/package/${pkgJson.name ?? `@agentdrip/${dir}`}`,
      skillContent,
      skinCss: readFile("skin.css"),
      previewHtml: readFile("previews/landing.html"),
      lastSyncedAt: now,
      firstSeenAt: now,
      weeklyDownloads: 0,
      moodboard: readFile("moodboard.json"),
      embedding,
    });

    // Index into FTS5
    const tagsFlat = agentdrip.tags ? agentdrip.tags.join(" ") : "";
    await client.execute({
      sql: `INSERT INTO packages_fts(rowid, slug, display_name, description, philosophy, tags, skill_excerpt)
            VALUES ((SELECT rowid FROM packages WHERE slug = ?), ?, ?, ?, ?, ?, ?)`,
      args: [slug, slug, displayName, description ?? "", philosophy ?? "", tagsFlat, buildFtsExcerpt(skillContent)],
    });

    console.log(`Seeded: ${displayName} (${slug})`);
    count++;
  }

  return count;
}

async function seed() {
  console.log("Resetting database...");
  await resetDb();

  // Try npm sync first (skip if LOCAL_SEED env var is set)
  if (!process.env.LOCAL_SEED) {
    console.log("\nAttempting npm sync...");
    try {
      const result = await syncAllPackages();
      if (result.synced > 0) {
        console.log(`Synced ${result.synced} packages from npm.`);
        if (result.errors.length > 0) {
          console.log(`Errors: ${result.errors.join(", ")}`);
        }
        // TODO: build FTS index for npm-synced packages
        client.close();
        return;
      }
      console.log("No packages found on npm, falling back to local seed.");
    } catch (err) {
      console.log(`npm sync failed (${err}), falling back to local seed.`);
    }
  } else {
    console.log("\nLOCAL_SEED set, skipping npm sync.");
  }

  // Fallback: seed from local packages directory
  const count = await seedFromLocal();
  console.log(`\nSeeded ${count} packages from local directory.`);
  if (process.env.OPENROUTER_API_KEY) {
    console.log("Embeddings: generated (semantic search enabled)");
  } else {
    console.log("Embeddings: skipped (no OPENROUTER_API_KEY, using FTS only)");
  }
  console.log(`Database at: ${dbPath}`);
  client.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
