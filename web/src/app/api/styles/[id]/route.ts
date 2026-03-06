import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    let [pkg] = await db
      .select()
      .from(packages)
      .where(eq(packages.slug, id));
    if (!pkg) {
      [pkg] = await db
        .select()
        .from(packages)
        .where(eq(packages.name, id));
    }
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("GET /api/styles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 },
    );
  }
}
