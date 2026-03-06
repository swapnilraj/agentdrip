CREATE TABLE `packages` (
	`name` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`version` text NOT NULL,
	`display_name` text NOT NULL,
	`description` text,
	`philosophy` text,
	`author_name` text NOT NULL,
	`tags` text,
	`colors` text,
	`fonts` text,
	`thumbnail_url` text,
	`npm_url` text NOT NULL,
	`skill_content` text,
	`skin_css` text,
	`preview_html` text,
	`last_synced_at` text NOT NULL,
	`first_seen_at` text NOT NULL,
	`weekly_downloads` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packages_slug_unique` ON `packages` (`slug`);