CREATE TABLE `active_workout_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_by_user_id` text NOT NULL,
	`workout_id` text NOT NULL,
	`session_started_at` integer NOT NULL,
	`participant_count` integer DEFAULT 1,
	`status` text DEFAULT 'active',
	`do_session_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `active_workout_sessions_created_by_user_idx` ON `active_workout_sessions` (`created_by_user_id`);--> statement-breakpoint
CREATE TABLE `users_public` (
	`id` text PRIMARY KEY NOT NULL,
	`handle` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`last_active` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `handle_idx` ON `users_public` (`handle`);--> statement-breakpoint
CREATE UNIQUE INDEX `name_idx` ON `users_public` (`name`);--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_by_user_id` text NOT NULL,
	`is_public` integer DEFAULT false,
	`invite_code` text,
	`member_count` integer DEFAULT 1,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users_public`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_invite_code_unique` ON `teams` (`invite_code`);--> statement-breakpoint
CREATE INDEX `teams_created_by_user_idx` ON `teams` (`created_by_user_id`);--> statement-breakpoint
CREATE INDEX `teams_invite_code_idx` ON `teams` (`invite_code`);--> statement-breakpoint
CREATE TABLE `team_rosters` (
	`team_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	PRIMARY KEY(`team_id`, `user_id`),
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users_public`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_roster_idx` ON `team_rosters` (`user_id`);