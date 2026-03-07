import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") || req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (expected && secret !== expected && secret !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  // Add embedding column if missing
  try {
    await db.run(sql`ALTER TABLE packages ADD COLUMN embedding TEXT`);
    results.push("Added embedding column");
  } catch {
    results.push("embedding column already exists");
  }

  // Create FTS5 table if missing
  try {
    await db.run(sql`CREATE VIRTUAL TABLE IF NOT EXISTS packages_fts USING fts5(
      slug,
      display_name,
      description,
      philosophy,
      tags,
      skill_excerpt,
      tokenize='porter unicode61'
    )`);
    results.push("Created packages_fts table");
  } catch (e) {
    results.push(`FTS5 creation: ${e}`);
  }

  // Populate FTS from existing packages
  try {
    // Clear existing FTS data
    await db.run(sql`DELETE FROM packages_fts`);

    const rows = await db.all<{
      slug: string;
      display_name: string;
      description: string | null;
      philosophy: string | null;
      tags: string | null;
      skill_content: string | null;
    }>(sql`SELECT slug, display_name, description, philosophy, tags, skill_content FROM packages`);

    for (const row of rows) {
      let tagsFlat = "";
      if (row.tags) {
        try { tagsFlat = JSON.parse(row.tags).join(" "); } catch {}
      }
      const excerpt = (row.skill_content || "").slice(0, 1500);

      await db.run(sql`INSERT INTO packages_fts(slug, display_name, description, philosophy, tags, skill_excerpt)
        VALUES (${row.slug}, ${row.display_name}, ${row.description ?? ""}, ${row.philosophy ?? ""}, ${tagsFlat}, ${excerpt})`);
    }
    results.push(`Indexed ${rows.length} packages into FTS`);
  } catch (e) {
    results.push(`FTS indexing: ${e}`);
  }

  return NextResponse.json({ results });
}
