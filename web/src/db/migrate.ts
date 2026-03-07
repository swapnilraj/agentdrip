import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./data/agentdrip.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Each migration is idempotent — safe to re-run.
// Add new migrations at the bottom.
const migrations: { name: string; sql: string }[] = [
  {
    name: "add embedding column",
    sql: "ALTER TABLE packages ADD COLUMN embedding TEXT",
  },
  {
    name: "create FTS5 table",
    sql: `CREATE VIRTUAL TABLE IF NOT EXISTS packages_fts USING fts5(
      slug, display_name, description, philosophy, tags, skill_excerpt,
      tokenize='porter unicode61'
    )`,
  },
];

async function migrate() {
  console.log("Running migrations...");

  for (const m of migrations) {
    try {
      await client.execute(m.sql);
      console.log(`  [+] ${m.name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // "duplicate column" or "already exists" = already applied
      if (msg.includes("duplicate") || msg.includes("already exists")) {
        console.log(`  [=] ${m.name} (already applied)`);
      } else {
        console.error(`  [!] ${m.name}: ${msg}`);
        throw err;
      }
    }
  }

  console.log("Migrations complete.");
  client.close();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
