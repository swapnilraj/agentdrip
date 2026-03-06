import { getApiUrl, readConfig } from "./config.js";

export async function fetchApi(path: string, opts?: RequestInit): Promise<Response> {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts?.headers as Record<string, string> || {}),
  };

  const config = readConfig();
  if (config.author) {
    headers["x-api-key"] = config.author;
  }

  const res = await fetch(url, { ...opts, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body || res.statusText}`);
  }

  return res;
}
