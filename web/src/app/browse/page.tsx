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

interface TagCount {
  tag: string;
  count: number;
}

type SortOption = "recent" | "popular" | "name";

export default function BrowsePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<TagCount[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.ok ? r.json() : [])
      .then(setTags)
      .catch(() => {});
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Styles</h1>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTag === null
                ? "bg-purple-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t.tag}
              onClick={() => setActiveTag(activeTag === t.tag ? null : t.tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTag === t.tag
                  ? "bg-purple-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {t.tag} ({t.count})
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 mb-10">
        <div className="flex flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder='Try "warm and friendly" or "raw monospace brutalism"...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
          />
          {!search && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">
              Semantic
            </span>
          )}
        </div>
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
        {search && (
          <p className="text-xs text-neutral-600">
            Searching across names, descriptions, philosophies, tags, and skill content
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : packages.length === 0 ? (
        <p className="text-neutral-500">No styles found.</p>
      ) : (
        <div data-drip="grid" className="columns-1 sm:columns-2 lg:columns-3 gap-5">
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
