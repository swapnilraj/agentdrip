import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { StyleDetailClient } from "./StyleDetailClient";

export default async function StylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pkg = await db
    .select()
    .from(packages)
    .where(eq(packages.slug, id))
    .get();
  if (!pkg) notFound();

  // Map package to the shape StyleDetailClient expects
  const style = {
    id: pkg.slug,
    name: pkg.displayName,
    slug: pkg.slug,
    description: pkg.description,
    philosophy: pkg.philosophy,
    skillContent: pkg.skillContent ?? "",
    authorName: pkg.authorName,
    authorUrl: pkg.npmUrl,
    thumbnailUrl: pkg.thumbnailUrl,
    previewHtml: pkg.previewHtml,
    tags: pkg.tags,
    likesCount: pkg.weeklyDownloads ?? 0,
    forksCount: 0,
    forkedFromId: null,
    version: pkg.version,
    createdAt: pkg.firstSeenAt,
    updatedAt: pkg.lastSyncedAt,
    skinCss: pkg.skinCss,
    moodboard: pkg.moodboard ?? null,
  };

  return (
    <StyleDetailClient
      style={style}
      pages={[]}
      images={[]}
      forkedFromName={null}
    />
  );
}
