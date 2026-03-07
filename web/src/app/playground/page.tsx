"use client";

import { useState, useEffect, useRef } from "react";

interface StyleOption {
  slug: string;
  displayName: string;
}

export default function PlaygroundPage() {
  const [styles, setStyles] = useState<StyleOption[]>([]);
  const [slug, setSlug] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [resultHtml, setResultHtml] = useState("");
  const [meta, setMeta] = useState<{ model: string; tokensUsed: number } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/api/styles?limit=50")
      .then((r) => r.json())
      .then((data) => {
        setStyles(data.packages ?? []);
        if (data.packages?.length) setSlug(data.packages[0].slug);
      })
      .catch(() => setError("Failed to load styles"));
  }, []);

  async function handleGenerate() {
    if (!slug || !prompt.trim()) return;
    setGenerating(true);
    setError("");
    setRetryAfter(null);
    setResultHtml("");
    setMeta(null);

    try {
      const res = await fetch("/api/playground/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, prompt }),
      });

      if (res.status === 429) {
        const retry = res.headers.get("Retry-After");
        setRetryAfter(retry ? parseInt(retry, 10) : 60);
        setError("Rate limited. Please wait before trying again.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }

      setResultHtml(data.html);
      setMeta({ model: data.model, tokensUsed: data.tokensUsed });
    } catch {
      setError("Network error");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    if (!resultHtml || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(resultHtml);
      doc.close();
    }
  }, [resultHtml]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
          <p className="mt-2 text-neutral-400">
            Pick a design style, describe what you want, and generate a styled
            HTML page powered by AI.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="style-select" className="block text-sm font-medium text-neutral-300 mb-1">
              Style
            </label>
            <select
              id="style-select"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {styles.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prompt-input" className="block text-sm font-medium text-neutral-300 mb-1">
              Prompt
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="Describe the page you want to generate..."
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="mt-1 text-xs text-neutral-500 text-right">
              {prompt.length}/500
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleGenerate}
              disabled={generating || !slug || !prompt.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {generating ? "Generating..." : "Generate"}
            </button>
            <p className="text-xs text-neutral-500">
              Rate limit: 5/hour, 20/day
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
            {error}
            {retryAfter && (
              <span className="ml-1 text-red-400">
                (retry after {retryAfter}s)
              </span>
            )}
          </div>
        )}

        {resultHtml && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Result</span>
              {meta && (
                <span>
                  {meta.model} &middot; {meta.tokensUsed.toLocaleString()} tokens
                </span>
              )}
            </div>
            <iframe
              ref={iframeRef}
              sandbox=""
              className="w-full rounded-md border border-neutral-800"
              style={{ height: 600, background: "white" }}
              title="Generated page"
            />
          </div>
        )}
      </div>
    </div>
  );
}
