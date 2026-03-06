import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface DripConfig {
  author?: string;
  apiUrl?: string;
}

const CONFIG_PATH = join(homedir(), ".driprc");
const DEFAULT_API_URL = "http://localhost:3000";

export function readConfig(): DripConfig {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw) as DripConfig;
  } catch {
    return {};
  }
}

export function writeConfig(config: DripConfig): void {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

export function getApiUrl(): string {
  return readConfig().apiUrl || DEFAULT_API_URL;
}
