const EMBEDDING_MODEL = "openai/text-embedding-3-small";

export async function getEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  // Truncate to ~8000 tokens worth of text (~32k chars)
  const truncated = text.slice(0, 32000);

  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: truncated,
    }),
  });

  if (!res.ok) {
    console.error("Embedding API error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data.data?.[0]?.embedding ?? null;
}

export function buildEmbeddingText(pkg: {
  displayName: string;
  description: string | null;
  philosophy: string | null;
  tags: string | null;
  skillContent: string | null;
}): string {
  const parts = [
    pkg.displayName,
    pkg.description,
    pkg.philosophy,
  ];

  if (pkg.tags) {
    try {
      const tagList = JSON.parse(pkg.tags) as string[];
      parts.push(tagList.join(", "));
    } catch {}
  }

  // Include first 2000 chars of skill content for richer semantic signal
  if (pkg.skillContent) {
    parts.push(pkg.skillContent.slice(0, 2000));
  }

  return parts.filter(Boolean).join("\n\n");
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
