import Link from "next/link";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { StyleCard } from "@/components/StyleCard";

export default async function HomePage() {
  const featured = await db
    .select()
    .from(packages)
    .orderBy(desc(packages.weeklyDownloads))
    .limit(6);

  return (
    <div>
      <section data-drip="hero" className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 data-drip="hero:title" className="text-5xl md:text-6xl font-bold tracking-tight">
          Design Skills for the{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Era
          </span>
        </h1>
        <p data-drip="hero:subtitle" className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
          Publish, browse, and fork design styles that teach AI agents how to
          build beautiful pages.
        </p>
        <div data-drip="hero:actions" className="mt-8 flex justify-center gap-4">
          <Link
            href="/browse"
            data-drip="button"
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
          >
            Browse Styles
          </Link>
          <Link
            href="/publish"
            data-drip="button"
            className="px-6 py-3 rounded-lg border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-medium transition-colors"
          >
            Publish Yours
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <h2 className="text-2xl font-semibold mb-8">Featured Styles</h2>
          <div data-drip="grid" className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {featured.map((pkg) => (
              <StyleCard
                key={pkg.name}
                slug={pkg.slug}
                displayName={pkg.displayName}
                authorName={pkg.authorName}
                tags={pkg.tags}
                weeklyDownloads={pkg.weeklyDownloads ?? 0}
                previewHtml={pkg.previewHtml}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
