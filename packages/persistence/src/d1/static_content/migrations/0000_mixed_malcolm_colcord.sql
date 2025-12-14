CREATE TABLE `plan_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`author_user_id` text,
	`author_name` text NOT NULL,
	`author_credentials` text,
	`min_experience_level` text NOT NULL,
	`max_experience_level` text NOT NULL,
	`duration_type` text NOT NULL,
	`duration_weeks_min` integer NOT NULL,
	`duration_weeks_max` integer NOT NULL,
	`frequency_type` text NOT NULL,
	`workouts_per_week_min` integer NOT NULL,
	`workouts_per_week_max` integer NOT NULL,
	`tags` text NOT NULL,
	`required_equipment` text,
	`structure_json` text NOT NULL,
	`rules_json` text NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`rating_average` real,
	`rating_count` integer DEFAULT 0 NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`preview_workouts` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`published_at` integer
);
--> statement-breakpoint
CREATE INDEX `plan_templates_experience_idx` ON `plan_templates` (`min_experience_level`,`max_experience_level`);--> statement-breakpoint
CREATE INDEX `plan_templates_duration_idx` ON `plan_templates` (`duration_weeks_min`,`duration_weeks_max`);--> statement-breakpoint
CREATE INDEX `plan_templates_public_featured_idx` ON `plan_templates` (`is_public`,`is_featured`);--> statement-breakpoint
CREATE INDEX `plan_templates_rating_idx` ON `plan_templates` (`rating_average`);--> statement-breakpoint
CREATE TABLE `template_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`review_text` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`template_id`) REFERENCES `plan_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `template_ratings_template_id_idx` ON `template_ratings` (`template_id`);--> statement-breakpoint
CREATE INDEX `template_ratings_user_id_idx` ON `template_ratings` (`user_id`);--> statement-breakpoint
CREATE TABLE `template_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`tag` text NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `plan_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `template_tags_template_id_idx` ON `template_tags` (`template_id`);--> statement-breakpoint
CREATE INDEX `template_tags_tag_idx` ON `template_tags` (`tag`);