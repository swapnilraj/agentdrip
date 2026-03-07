import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const packages = sqliteTable("packages", {
  name: text("name").primaryKey(),           // "@agentdrip/brutalist"
  slug: text("slug").notNull().unique(),     // "brutalist"
  version: text("version").notNull(),        // "1.0.0"
  displayName: text("display_name").notNull(), // "Brutalist"
  description: text("description"),
  philosophy: text("philosophy"),
  authorName: text("author_name").notNull(),
  tags: text("tags"),                        // JSON array string
  colors: text("colors"),                    // JSON object string
  fonts: text("fonts"),                      // JSON array string
  thumbnailUrl: text("thumbnail_url"),
  npmUrl: text("npm_url").notNull(),
  skillContent: text("skill_content"),       // cached skill.md
  skinCss: text("skin_css"),                 // cached skin.css
  previewHtml: text("preview_html"),         // cached landing.html
  lastSyncedAt: text("last_synced_at").notNull(),
  firstSeenAt: text("first_seen_at").notNull(),
  weeklyDownloads: integer("weekly_downloads").default(0),
  moodboard: text("moodboard"),              // JSON string of moodboard data
  embedding: text("embedding"),              // JSON array of floats (vector)
});
