import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select({ tags: packages.tags }).from(packages);

    const counts = new Map<string, number>();
    for (const row of rows) {
      if (!row.tags) continue;
      try {
        const parsed: string[] = JSON.parse(row.tags);
        for (const tag of parsed) {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        }
      } catch {
        // skip malformed tags
      }
    }

    const result = Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
