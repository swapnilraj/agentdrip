import Link from "next/link";
import { StylePreview } from "./StylePreview";

interface StyleCardProps {
  slug: string;
  displayName: string;
  authorName: string;
  tags: string | null;
  weeklyDownloads: number;
  previewHtml: string | null;
}

export function StyleCard({
  slug,
  displayName,
  authorName,
  tags,
  weeklyDownloads,
  previewHtml,
}: StyleCardProps) {
  const tagList = tags ? (JSON.parse(tags) as string[]) : [];

  return (
    <Link
      href={`/style/${slug}`}
      data-drip="card"
      className="group block rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-colors hover:border-purple-500/60"
    >
      <div data-drip="card:preview" className="aspect-[4/3] bg-neutral-800 overflow-hidden relative">
        {previewHtml ? (
          <StylePreview
            html={previewHtml}
            className="w-full h-full pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
            No preview
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 data-drip="card:title" className="font-semibold text-white group-hover:text-purple-300 transition-colors">
          {displayName}
        </h3>
        <div data-drip="card:meta" className="text-sm text-neutral-400 mt-1">
          <p>{authorName}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
            <span>{weeklyDownloads} downloads/week</span>
          </div>
        </div>
        {tagList.length > 0 && (
          <div data-drip="card:tags" className="flex flex-wrap gap-1.5 mt-3">
            {tagList.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
