import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";

const NPM_REGISTRY = "https://registry.npmjs.org";
const NPM_SEARCH = `${NPM_REGISTRY}/-/v1/search`;
const UNPKG = "https://unpkg.com";
const NPM_DOWNLOADS = "https://api.npmjs.org/downloads/point/last-week";

interface NpmSearchResult {
  objects: Array<{
    package: {
      name: string;
      version: string;
      description?: string;
      author?: { name?: string };
      keywords?: string[];
      links?: { npm?: string };
    };
  }>;
}

interface NpmPackageMeta {
  name: string;
  version: string;
  description?: string;
  author?: string | { name?: string };
  keywords?: string[];
  agentdrip?: {
    type?: string;
    slug?: string;
    displayName?: string;
    philosophy?: string;
    tags?: string[];
    colors?: Record<string, string>;
    fonts?: string[];
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function discoverPackages(): Promise<string[]> {
  const data = await fetchJson<NpmSearchResult>(
    `${NPM_SEARCH}?text=keywords:agentdrip+keywords:design-skill&size=250`,
  );
  if (!data) return [];
  return data.objects.map((o) => o.package.name);
}

async function fetchPackageDetails(packageName: string) {
  const meta = await fetchJson<NpmPackageMeta>(
    `${NPM_REGISTRY}/${encodeURIComponent(packageName)}/latest`,
  );
  if (!meta) return null;

  const version = meta.version;
  const base = `${UNPKG}/${packageName}@${version}`;

  const [skillContent, skinCss, previewHtml, downloads, moodboardRaw] = await Promise.all([
    fetchText(`${base}/skill.md`),
    fetchText(`${base}/skin.css`),
    fetchText(`${base}/previews/landing.html`),
    fetchJson<{ downloads?: number }>(`${NPM_DOWNLOADS}/${encodeURIComponent(packageName)}`),
    fetchText(`${base}/moodboard.json`),
  ]);

  const agentdrip = meta.agentdrip;
  const authorRaw = meta.author;
  const authorName =
    typeof authorRaw === "string"
      ? authorRaw
      : authorRaw?.name ?? "Unknown";

  const slug = agentdrip?.slug ?? packageName.replace(/^@[^/]+\//, "");
  const displayName = agentdrip?.displayName ?? slug;

  return {
    name: packageName,
    slug,
    version,
    displayName,
    description: meta.description ?? null,
    philosophy: agentdrip?.philosophy ?? null,
    authorName,
    tags: agentdrip?.tags ? JSON.stringify(agentdrip.tags) : null,
    colors: agentdrip?.colors ? JSON.stringify(agentdrip.colors) : null,
    fonts: agentdrip?.fonts ? JSON.stringify(agentdrip.fonts) : null,
    thumbnailUrl: null,
    npmUrl: `https://www.npmjs.com/package/${packageName}`,
    skillContent: skillContent ?? null,
    skinCss: skinCss ?? null,
    previewHtml: previewHtml ?? null,
    moodboard: moodboardRaw ?? null,
    lastSyncedAt: new Date().toISOString(),
    firstSeenAt: new Date().toISOString(),
    weeklyDownloads: downloads?.downloads ?? 0,
  };
}

async function upsertPackage(data: NonNullable<Awaited<ReturnType<typeof fetchPackageDetails>>>) {
  const existing = await db
    .select({ firstSeenAt: packages.firstSeenAt })
    .from(packages)
    .where(eq(packages.name, data.name));

  if (existing.length > 0) {
    // Preserve firstSeenAt on update
    const { firstSeenAt: _, ...updateData } = data;
    await db.update(packages).set(updateData).where(eq(packages.name, data.name));
  } else {
    await db.insert(packages).values(data);
  }
}

export async function syncAllPackages(): Promise<{
  discovered: number;
  synced: number;
  errors: string[];
}> {
  const names = await discoverPackages();
  const errors: string[] = [];
  let synced = 0;

  for (const name of names) {
    try {
      const data = await fetchPackageDetails(name);
      if (data) {
        await upsertPackage(data);
        synced++;
      } else {
        errors.push(`Failed to fetch details for ${name}`);
      }
    } catch (err) {
      errors.push(`Error syncing ${name}: ${err}`);
    }
  }

  return { discovered: names.length, synced, errors };
}

export async function syncPackage(packageName: string): Promise<boolean> {
  const data = await fetchPackageDetails(packageName);
  if (!data) return false;
  await upsertPackage(data);
  return true;
}
