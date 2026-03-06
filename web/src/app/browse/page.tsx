"use client";

import { useEffect, useState } from "react";
import { StyleCard } from "@/components/StyleCard";

interface Package {
  name: string;
  slug: string;
  displayName: string;
  description: string | null;
  authorName: string;
  tags: string | null;
  weeklyDownloads: number;
  previewHtml: string | null;
}

type SortOption = "recent" | "popular" | "name";

export default function BrowsePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({ sort });
      if (search) params.set("search", search);
      if (activeTag) params.set("tag", activeTag);
      const res = await fetch(`/api/styles?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages ?? []);
      }
      setLoading(false);
    }
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [search, sort, activeTag]);

  const allTags = Array.from(
    new Set(
      packages
        .flatMap((p) => {
          if (!p.tags) return [];
          try { return JSON.parse(p.tags) as string[]; } catch { return []; }
        })
        .filter(Boolean)
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Styles</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search styles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="popular">Popular</option>
          <option value="recent">Recent</option>
          <option value="name">Name</option>
        </select>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !activeTag
                ? "bg-purple-600 border-purple-600 text-white"
                : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeTag === tag
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : packages.length === 0 ? (
        <p className="text-neutral-500">No styles found.</p>
      ) : (
        <div data-drip="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
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
      )}
    </div>
  );
}
