CREATE TABLE `activity_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text NOT NULL,
	`activity_id` text NOT NULL,
	`activity_name` text NOT NULL,
	`order_index` integer NOT NULL,
	`status` text DEFAULT 'not_started',
	`started_at` integer,
	`completed_at` integer,
	`current_set` integer,
	`current_rep` integer,
	`current_weight` real,
	`current_distance_meters` integer,
	`current_heart_rate` integer,
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `activity_progress_participant_id_order_idx` ON `activity_progress` (`participant_id`,`order_index`);--> statement-breakpoint
CREATE TABLE `session_metadata` (
	`id` text PRIMARY KEY NOT NULL,
	`created_by_user_id` text NOT NULL,
	`workout_id` text NOT NULL,
	`plan_id` text,
	`workout_template_id` text,
	`workout_type` text NOT NULL,
	`activities_json` text NOT NULL,
	`configuration_json` text NOT NULL,
	`status` text DEFAULT 'preparing',
	`current_activity_index` integer DEFAULT 0,
	`live_progress_json` text,
	`completed_activities_json` text,
	`activity_feed_json` text,
	`started_at` integer,
	`paused_at` integer,
	`resumed_at` integer,
	`completed_at` integer,
	`abandoned_at` integer,
	`total_paused_seconds` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`joined_at` integer DEFAULT (unixepoch()),
	`last_heartbeat_at` integer DEFAULT (unixepoch()),
	`status` text DEFAULT 'active'
);
--> statement-breakpoint
CREATE INDEX `participants_user_id_idx` ON `participants` (`user_id`);--> statement-breakpoint
CREATE TABLE `session_chat` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE no action
);
