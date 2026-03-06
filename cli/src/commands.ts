import { fetchApi } from "./api.js";
import { readConfig, writeConfig } from "./config.js";

function padRight(str: string, len: number): string {
  return str.length >= len ? str.slice(0, len) : str + " ".repeat(len - str.length);
}

function printTable(rows: string[][]): void {
  if (rows.length === 0) return;
  const cols = rows[0].length;
  const widths: number[] = [];
  for (let c = 0; c < cols; c++) {
    widths.push(Math.max(...rows.map(r => (r[c] || "").length)));
  }
  for (const row of rows) {
    console.log("  " + row.map((cell, i) => padRight(cell, widths[i] + 2)).join(""));
  }
}

export async function browse(json: boolean): Promise<void> {
  const res = await fetchApi("/api/packages?sort=popular");
  const data = await res.json();
  if (json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  const packages = Array.isArray(data) ? data : data.packages || [];
  const rows = [["NAME", "AUTHOR", "DOWNLOADS", "VERSION"]];
  for (const p of packages) {
    rows.push([
      p.displayName || p.name || "",
      p.authorName || "",
      String(p.weeklyDownloads ?? 0),
      p.version || "",
    ]);
  }
  printTable(rows);
}

export async function search(query: string, json: boolean): Promise<void> {
  const res = await fetchApi(`/api/packages?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  const packages = Array.isArray(data) ? data : data.packages || [];
  const rows = [["NAME", "AUTHOR", "DOWNLOADS"]];
  for (const p of packages) {
    rows.push([p.displayName || p.name || "", p.authorName || "", String(p.weeklyDownloads ?? 0)]);
  }
  printTable(rows);
}

export async function get(slug: string, json: boolean): Promise<void> {
  // Fetch skill.md from unpkg CDN
  const npmName = slug.startsWith("@") ? slug : `@agentdrip/${slug}`;
  const url = `https://unpkg.com/${npmName}@latest/skill.md`;
  const res = await fetch(url);
  if (!res.ok) {
    // Fallback to our API cache
    const apiRes = await fetchApi(`/api/packages/${encodeURIComponent(slug)}`);
    const data = await apiRes.json();
    if (json) {
      console.log(JSON.stringify({ slug, content: data.skillContent }, null, 2));
    } else {
      console.log(data.skillContent || "Not found");
    }
    return;
  }
  const content = await res.text();
  if (json) {
    console.log(JSON.stringify({ slug, content }, null, 2));
  } else {
    console.log(content);
  }
}

export async function wear(slug: string): Promise<void> {
  // Fetch skin.css from unpkg CDN
  const npmName = slug.startsWith("@") ? slug : `@agentdrip/${slug}`;
  const url = `https://unpkg.com/${npmName}@latest/skin.css`;
  const res = await fetch(url);
  if (!res.ok) {
    // Fallback to our API cache
    const apiRes = await fetchApi(`/api/packages/${encodeURIComponent(slug)}/skin`);
    const css = await apiRes.text();
    console.log(css);
    return;
  }
  const css = await res.text();
  console.log(css);
}

export function publish(): void {
  console.log(`Publishing is done via npm:

  1. Create your package with skill.md, skin.css, and package.json
  2. Add keywords: ["agentdrip", "design-skill"] to package.json
  3. Run: npm publish --access public

  Your style will be automatically indexed on AgentDrip.
  See https://agentdrip.com/publish for full instructions.`);
}

export function fork(slug: string): void {
  const npmName = slug.startsWith("@") ? slug : `@agentdrip/${slug}`;
  console.log(`To fork "${slug}":

  npm install ${npmName}
  mkdir my-${slug} && cd my-${slug}
  cp node_modules/${npmName}/skill.md ./skill.md
  cp node_modules/${npmName}/skin.css ./skin.css
  # Edit the files, then:
  npm publish --access public`);
}

export function configSet(key: string, value: string): void {
  const config = readConfig();
  (config as Record<string, string>)[key] = value;
  writeConfig(config);
  console.log(`Set ${key} = ${value}`);
}

export function configGet(): void {
  const config = readConfig();
  console.log(JSON.stringify(config, null, 2));
}
