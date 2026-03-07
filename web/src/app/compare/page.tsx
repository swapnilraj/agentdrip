"use client";

import { useState, useEffect, useCallback } from "react";

interface StylePackage {
  slug: string;
  displayName: string;
  previewHtml: string | null;
  tags: string[];
  skinCss: string | null;
}

type ViewMode = "preview" | "generate";

export default function ComparePage() {
  const [packages, setPackages] = useState<StylePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<(string | null)[]>([null, null]);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [prompt, setPrompt] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState<Record<string, string>>(
    {}
  );
  const [generating, setGenerating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/styles?limit=50")
      .then((r) => r.json())
      .then((data) => {
        setPackages(data.packages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectedPackages = selections.map((slug) =>
    slug ? packages.find((p) => p.slug === slug) ?? null : null
  );

  const addColumn = () => {
    if (selections.length < 3) {
      setSelections([...selections, null]);
    }
  };

  const removeColumn = (index: number) => {
    if (selections.length <= 2) return;
    setSelections(selections.filter((_, i) => i !== index));
  };

  const updateSelection = (index: number, slug: string) => {
    const next = [...selections];
    next[index] = slug || null;
    setSelections(next);
  };

  const generateAll = useCallback(async () => {
    if (!prompt.trim()) return;
    const slugs = selections.filter(Boolean) as string[];
    const nextGenerating: Record<string, boolean> = {};
    slugs.forEach((s) => (nextGenerating[s] = true));
    setGenerating(nextGenerating);
    setGeneratedHtml({});

    await Promise.all(
      slugs.map(async (slug) => {
        try {
          const res = await fetch("/api/playground/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, prompt: prompt.trim() }),
          });
          const data = await res.json();
          setGeneratedHtml((prev) => ({ ...prev, [slug]: data.html || "" }));
        } catch {
          setGeneratedHtml((prev) => ({
            ...prev,
            [slug]: "<p style='color:red;padding:1rem'>Generation failed</p>",
          }));
        } finally {
          setGenerating((prev) => ({ ...prev, [slug]: false }));
        }
      })
    );
  }, [prompt, selections]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <p className="text-neutral-400">Loading styles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Compare Styles</h1>

        {/* View mode toggle */}
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-neutral-800 overflow-hidden">
            <button
              onClick={() => setViewMode("preview")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "preview"
                  ? "bg-purple-600 text-white"
                  : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Preview HTML
            </button>
            <button
              onClick={() => setViewMode("generate")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "generate"
                  ? "bg-purple-600 text-white"
                  : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Generate from prompt
            </button>
          </div>

          {selections.length < 3 && (
            <button
              onClick={addColumn}
              className="px-4 py-2 text-sm rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-100 hover:border-purple-500 transition-colors"
            >
              + Add style
            </button>
          )}
        </div>

        {/* Generate prompt bar */}
        {viewMode === "generate" && (
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateAll()}
              placeholder="Describe the page you want to generate..."
              className="flex-1 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={generateAll}
              disabled={
                !prompt.trim() || Object.values(generating).some(Boolean)
              }
              className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate
            </button>
          </div>
        )}

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selections.map((slug, index) => {
            const pkg = selectedPackages[index];
            const iframeHtml =
              viewMode === "preview"
                ? pkg?.previewHtml || null
                : slug
                  ? generatedHtml[slug] || null
                  : null;
            const isGenerating =
              viewMode === "generate" && slug ? generating[slug] : false;

            return (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center gap-2 p-3 border-b border-neutral-800">
                  <select
                    value={slug || ""}
                    onChange={(e) => updateSelection(index, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-100 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select a style...</option>
                    {packages.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.displayName || p.slug}
                      </option>
                    ))}
                  </select>

                  {selections.length > 2 && (
                    <button
                      onClick={() => removeColumn(index)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors text-sm"
                      title="Remove"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Style name */}
                {pkg && (
                  <div className="px-3 py-2 border-b border-neutral-800">
                    <p className="text-sm font-semibold text-purple-400">
                      {pkg.displayName || pkg.slug}
                    </p>
                  </div>
                )}

                {/* Preview area */}
                <div className="flex-1 min-h-[400px] bg-neutral-950 relative">
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 z-10">
                      <p className="text-neutral-400 text-sm animate-pulse">
                        Generating...
                      </p>
                    </div>
                  )}

                  {!slug && (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                      Select a style above
                    </div>
                  )}

                  {slug && !iframeHtml && !isGenerating && (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                      {viewMode === "preview"
                        ? "No preview available"
                        : "Enter a prompt and click Generate"}
                    </div>
                  )}

                  {iframeHtml && (
                    <iframe
                      srcDoc={iframeHtml}
                      sandbox=""
                      className="w-full h-full min-h-[400px] border-0"
                      style={{ background: "white" }}
                      title={`Preview of ${pkg?.displayName || slug}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
