#!/usr/bin/env node

import { browse, search, get, publish, fork, wear, configSet, configGet } from "./commands.js";

const args = process.argv.slice(2);
const command = args[0];

const flags: Record<string, string | boolean> = {};
const positional: string[] = [];

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith("--")) {
    const key = arg.slice(2);
    const next = args[i + 1];
    if (next && !next.startsWith("--")) {
      flags[key] = next;
      i++;
    } else {
      flags[key] = true;
    }
  } else {
    positional.push(arg);
  }
}

const json = flags.json === true;

function printHelp(): void {
  console.log(`Usage: drip <command> [options]

Commands:
  browse [--json]                      Browse popular styles
  search <query> [--json]              Search for styles
  get <slug> [--json]                  Get a skill file (from npm)
  wear <slug>                          Get CSS skin (from npm)
  publish                              Show how to publish via npm
  fork <slug>                          Show how to fork via npm
  config set <key> <value>             Set config value
  config get                           Show config`);
}

async function main(): Promise<void> {
  try {
    switch (command) {
      case "browse":
        await browse(json);
        break;
      case "search":
        if (!positional[0]) { console.error("Usage: drip search <query>"); process.exit(1); }
        await search(positional[0], json);
        break;
      case "get":
        if (!positional[0]) { console.error("Usage: drip get <slug>"); process.exit(1); }
        await get(positional[0], json);
        break;
      case "publish":
        publish();
        break;
      case "fork":
        if (!positional[0]) { console.error("Usage: drip fork <slug>"); process.exit(1); }
        fork(positional[0]);
        break;
      case "wear":
        if (!positional[0]) { console.error("Usage: drip wear <slug>"); process.exit(1); }
        await wear(positional[0]);
        break;
      case "config":
        if (positional[0] === "set") {
          if (!positional[1] || !positional[2]) { console.error("Usage: drip config set <key> <value>"); process.exit(1); }
          configSet(positional[1], positional[2]);
        } else if (positional[0] === "get") {
          configGet();
        } else {
          console.error("Usage: drip config [set|get]");
          process.exit(1);
        }
        break;
      case "--help":
      case "-h":
      case "help":
        printHelp();
        break;
      default:
        printHelp();
        if (command) process.exit(1);
        break;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${msg}`);
    process.exit(1);
  }
}

main();
