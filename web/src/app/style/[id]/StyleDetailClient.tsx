"use client";

import { useState } from "react";
import { StylePreview } from "@/components/StylePreview";
import { WearButton } from "@/components/WearButton";
import { PlaygroundPanel } from "@/components/PlaygroundPanel";

type Tab = "preview" | "skill" | "moodboard";

interface Props {
  style: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    philosophy: string | null;
    authorName: string;
    authorUrl: string | null;
    skillContent: string;
    previewHtml: string | null;
    tags: string | null;
    likesCount: number;
    version: string;
    skinCss: string | null;
    moodboard: string | null;
  };
  pages: unknown[];
  images: unknown[];
  forkedFromName: string | null;
}

export function StyleDetailClient({ style }: Props) {
  const [tab, setTab] = useState<Tab>("preview");
  const tags = style.tags ? JSON.parse(style.tags) as string[] : [];
  const npmName = `@agentdrip/${style.slug}`;

  const tabs: { key: Tab; label: string }[] = [
    { key: "preview", label: "Preview" },
    { key: "skill", label: "Skill File" },
    { key: "moodboard", label: "Moodboard" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{style.name}</h1>
          {style.description && (
            <p className="text-neutral-400 mt-2 max-w-2xl">{style.description}</p>
          )}
          {style.philosophy && (
            <p className="text-neutral-500 mt-2 max-w-2xl text-sm italic">{style.philosophy}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
            <span>by {style.authorName}</span>
            <span>v{style.version}</span>
            <span>{style.likesCount} downloads/week</span>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <WearButton styleId={style.slug} slug={style.slug} name={style.name} />
          <a
            href={`https://www.npmjs.com/package/${npmName}`}
            target="_blank"
            rel="noopener"
            className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            View on npm
          </a>
          <a
            href={`data:text/markdown;charset=utf-8,${encodeURIComponent(style.skillContent)}`}
            download={`${style.slug}.md`}
            className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-sm font-medium transition-colors"
          >
            Download
          </a>
        </div>
      </div>

      <div className="mb-8 p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-3">
        <span className="text-xs text-neutral-500">Install:</span>
        <code className="text-xs text-neutral-300 font-mono">npm install {npmName}</code>
        <span className="text-neutral-700 mx-1">|</span>
        <span className="text-xs text-neutral-500">CLI:</span>
        <code className="text-xs text-neutral-300 font-mono">drip get {style.slug}</code>
      </div>

      <div className="flex gap-1 border-b border-neutral-800 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-purple-500 text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "preview" && (
        <div className="rounded-xl border border-neutral-800 overflow-hidden bg-white">
          {style.previewHtml ? (
            <StylePreview html={style.previewHtml} className="w-full h-[600px]" />
          ) : (
            <div className="h-[600px] flex items-center justify-center text-neutral-500">
              No preview available
            </div>
          )}
        </div>
      )}

      {tab === "skill" && (
        <pre className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
          {style.skillContent}
        </pre>
      )}

      {tab === "moodboard" && (() => {
        let images: { url: string; alt: string; credit: string }[] = [];
        try {
          const parsed = style.moodboard ? JSON.parse(style.moodboard) : null;
          images = parsed?.images ?? [];
        } catch {
          // ignore parse errors
        }
        return images.length > 0 ? (
          <div style={{ columns: "2 300px", columnGap: "1rem" }}>
            {images.map((img, i) => (
              <div key={i} className="mb-4 break-inside-avoid rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <div className="p-3">
                  <p className="text-sm text-neutral-300">{img.alt}</p>
                  <p className="text-xs text-neutral-500 mt-1">{img.credit}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-neutral-500">
            No moodboard available
          </div>
        );
      })()}

      <PlaygroundPanel slug={style.slug} />
    </div>
  );
}
