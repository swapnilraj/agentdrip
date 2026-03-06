import { NextResponse } from "next/server";
import { syncAllPackages } from "@/lib/npm-indexer";

async function runSync() {
  const result = await syncAllPackages();
  return NextResponse.json(result);
}

// Vercel Cron calls GET
export async function GET(req: Request) {
  // Verify Vercel cron secret in production
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await runSync();
  } catch (error) {
    console.error("GET /api/sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

// Manual trigger via POST
export async function POST() {
  try {
    return await runSync();
  } catch (error) {
    console.error("POST /api/sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
