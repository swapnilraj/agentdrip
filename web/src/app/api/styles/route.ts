import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { desc, asc, like, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const tag = url.searchParams.get("tag");
    const sort = url.searchParams.get("sort") || "recent";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    const conditions: ReturnType<typeof like>[] = [];

    if (search) {
      conditions.push(like(packages.displayName, `%${search}%`));
    }
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
        .select({
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
        })
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
