"use client";

import { useState, useRef } from "react";

type Status = "idle" | "generating" | "done" | "error" | "rate-limited";

export function PlaygroundPanel({ slug }: { slug: string }) {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [html, setHtml] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function handleGenerate() {
    if (!prompt.trim() || status === "generating") return;

    setStatus("generating");
    setErrorMsg("");
    setHtml("");

    try {
      const res = await fetch("/api/playground/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, prompt: prompt.trim() }),
      });

      if (res.status === 429) {
        const ra = res.headers.get("Retry-After");
        setRetryAfter(ra ? parseInt(ra, 10) : 60);
        setStatus("rate-limited");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setHtml(data.html);
      setStatus("done");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Playground</h2>
      <p className="text-sm text-neutral-500 mb-4">
        Describe a page and generate it using this style. 5 generations per hour.
      </p>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          maxLength={500}
          placeholder="e.g. A portfolio page for a photographer..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || status === "generating"}
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {status === "generating" ? "Generating..." : "Generate"}
        </button>
      </div>

      <div className="text-right text-xs text-neutral-600 -mt-2 mb-4">
        {prompt.length}/500
      </div>

      {status === "generating" && (
        <div className="flex items-center justify-center h-64 rounded-xl border border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-3 text-neutral-400 text-sm">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating page...
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {status === "rate-limited" && (
        <div className="p-4 rounded-lg bg-yellow-950/50 border border-yellow-900 text-yellow-400 text-sm">
          Rate limit reached. Try again in {retryAfter} seconds.
        </div>
      )}

      {status === "done" && html && (
        <div className="rounded-xl border border-neutral-800 overflow-hidden bg-white">
          <iframe
            ref={iframeRef}
            srcDoc={html}
            sandbox=""
            className="w-full h-[600px]"
            style={{ border: "none" }}
            title="Generated page preview"
          />
        </div>
      )}
    </div>
  );
}
