CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `team_members`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `chat_time_idx` ON `chat_messages` (`created_at`);--> statement-breakpoint
CREATE TABLE `team_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text,
	`name` text NOT NULL,
	`description` text,
	`challenge_type` text,
	`start_date` integer,
	`end_date` integer,
	`status` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `team_challenges_team_id_idx` ON `team_challenges` (`team_id`);--> statement-breakpoint
CREATE TABLE `team_members` (
	`team_id` text,
	`user_id` text,
	`role` text DEFAULT 'member',
	`joined_at` integer DEFAULT (unixepoch()),
	PRIMARY KEY(`team_id`, `user_id`),
	FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `team_members_user_id_idx` ON `team_members` (`user_id`);--> statement-breakpoint
CREATE TABLE `team` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_public` integer DEFAULT false,
	`latest_chat_message_id` integer DEFAULT 0,
	`last_updated` integer DEFAULT (unixepoch())
);
