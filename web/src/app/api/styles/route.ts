import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { desc, asc, like, sql, inArray } from "drizzle-orm";
import { getEmbedding, cosineSimilarity } from "@/lib/embeddings";

// Select fields shared across all query paths
const selectFields = {
  name: packages.name,
  slug: packages.slug,
  displayName: packages.displayName,
  description: packages.description,
  philosophy: packages.philosophy,
  authorName: packages.authorName,
  thumbnailUrl: packages.thumbnailUrl,
  previewHtml: packages.previewHtml,
  tags: packages.tags,
  weeklyDownloads: packages.weeklyDownloads,
  npmUrl: packages.npmUrl,
  firstSeenAt: packages.firstSeenAt,
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const tag = url.searchParams.get("tag");
    const sort = url.searchParams.get("sort") || "recent";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // If there's a search query, use the semantic search pipeline
    if (search) {
      const results = await semanticSearch(search, tag, limit, offset);
      return NextResponse.json(results);
    }

    // Standard browse (no search) — use regular DB query
    const conditions: ReturnType<typeof like>[] = [];
    if (tag) {
      conditions.push(sql`${packages.tags} like ${"%" + tag + "%"}`);
    }

    const orderBy =
      sort === "popular"
        ? desc(packages.weeklyDownloads)
        : sort === "name"
          ? asc(packages.displayName)
          : desc(packages.firstSeenAt);

    const where =
      conditions.length > 0
        ? sql`${sql.join(conditions, sql` AND `)}`
        : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select(selectFields)
        .from(packages)
        .where(where)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(packages)
        .where(where),
    ]);

    return NextResponse.json({
      packages: rows,
      total: countResult[0].count,
    });
  } catch (error) {
    console.error("GET /api/styles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 },
    );
  }
}

async function semanticSearch(
  query: string,
  tag: string | null,
  limit: number,
  offset: number,
) {
  // Step 1: FTS5 full-text search — fast, scales to millions of rows
  let ftsResults: { slug: string; rank: number }[] = [];
  try {
    const ftsQuery = query
      .replace(/[^\w\s]/g, "") // strip special chars
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `"${w}"*`) // prefix matching
      .join(" OR ");

    if (ftsQuery) {
      const rawResult = await db.all<{ slug: string; rank: number }>(
        sql`SELECT slug, rank FROM packages_fts WHERE packages_fts MATCH ${ftsQuery} ORDER BY rank LIMIT 50`
      );
      ftsResults = rawResult;
    }
  } catch {
    // FTS table might not exist (e.g. Turso prod DB without FTS)
  }

  // Step 2: Try embedding-based search (if API key available and FTS gave few results)
  let embeddingResults: { slug: string; score: number }[] = [];
  const shouldTryEmbeddings = ftsResults.length < 3;

  if (shouldTryEmbeddings) {
    const queryEmbedding = await getEmbedding(query);
    if (queryEmbedding) {
      // Load all embeddings from DB
      const allPkgs = await db
        .select({ slug: packages.slug, embedding: packages.embedding })
        .from(packages);

      embeddingResults = allPkgs
        .filter((p) => p.embedding)
        .map((p) => ({
          slug: p.slug,
          score: cosineSimilarity(queryEmbedding, JSON.parse(p.embedding!)),
        }))
        .sort((a, b) => b.score - a.score);
    }
  }

  // Step 3: Merge results — FTS matches first (ranked), then embedding matches
  const seen = new Set<string>();
  const rankedSlugs: string[] = [];

  // FTS results come first (they matched keywords)
  for (const r of ftsResults) {
    if (!seen.has(r.slug)) {
      seen.add(r.slug);
      rankedSlugs.push(r.slug);
    }
  }

  // Embedding results fill in gaps (semantic matches that didn't match keywords)
  for (const r of embeddingResults) {
    if (!seen.has(r.slug) && r.score > 0.3) {
      seen.add(r.slug);
      rankedSlugs.push(r.slug);
    }
  }

  // Step 4: If both failed, fall back to LIKE
  if (rankedSlugs.length === 0) {
    const likeRows = await db
      .select(selectFields)
      .from(packages)
      .where(like(packages.displayName, `%${query}%`))
      .limit(limit);

    return { packages: likeRows, total: likeRows.length };
  }

  // Step 5: Fetch full package data for ranked slugs
  let rows = await db
    .select(selectFields)
    .from(packages)
    .where(inArray(packages.slug, rankedSlugs));

  // Apply tag filter if present
  if (tag) {
    rows = rows.filter((r) => r.tags && r.tags.includes(tag));
  }

  // Preserve ranking order
  const slugOrder = new Map(rankedSlugs.map((s, i) => [s, i]));
  rows.sort((a, b) => (slugOrder.get(a.slug) ?? 999) - (slugOrder.get(b.slug) ?? 999));

  // Apply pagination
  const total = rows.length;
  rows = rows.slice(offset, offset + limit);

  return { packages: rows, total };
}
