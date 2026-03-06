import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findPackage(slug: string) {
  const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));
  return pkg ?? null;
}
