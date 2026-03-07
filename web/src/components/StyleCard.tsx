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
  previewHtml,
}: StyleCardProps) {
  const tagList = tags ? (JSON.parse(tags) as string[]) : [];

  return (
    <Link
      href={`/style/${slug}`}
      data-drip="card"
      className="group block rounded-xl overflow-hidden relative break-inside-avoid mb-5 transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]"
    >
      <div data-drip="card:preview" className="aspect-[3/4] bg-neutral-800 overflow-hidden relative">
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
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16">
        <h3 data-drip="card:title" className="font-semibold text-lg text-white group-hover:text-purple-300 transition-colors">
          {displayName}
        </h3>
        <p className="text-sm text-neutral-300 mt-0.5">{authorName}</p>
        {tagList.length > 0 && (
          <div data-drip="card:tags" className="flex flex-wrap gap-1.5 mt-2">
            {tagList.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-white/15 text-neutral-200 backdrop-blur-sm"
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
