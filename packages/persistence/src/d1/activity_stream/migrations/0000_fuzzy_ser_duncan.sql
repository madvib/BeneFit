CREATE TABLE `activity_feed` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`creator_id` text NOT NULL,
	`team_id` text,
	`activity_type` text,
	`content_json` text,
	`visibility` text,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `activity_feed_owner_id_created_at_idx` ON `activity_feed` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `team_feed_time_idx` ON `activity_feed` (`team_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `activity_feed_created_at_idx` ON `activity_feed` (`created_at`);--> statement-breakpoint
CREATE TABLE `activity_reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_item_id` text,
	`user_id` text NOT NULL,
	`emoji` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`feed_item_id`) REFERENCES `activity_feed`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `activity_reactions_feed_item_id_idx` ON `activity_reactions` (`feed_item_id`);--> statement-breakpoint
CREATE INDEX `activity_reactions_user_id_idx` ON `activity_reactions` (`user_id`);