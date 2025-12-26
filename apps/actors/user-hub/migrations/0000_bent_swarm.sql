CREATE TABLE `check_ins` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`type` text NOT NULL,
	`triggered_by` text,
	`question` text NOT NULL,
	`user_response` text,
	`coach_analysis` text,
	`actions_json` text,
	`status` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`responded_at` integer,
	`dismissed_at` integer
);
--> statement-breakpoint
CREATE INDEX `check_ins_conversation_id_idx` ON `check_ins` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `check_ins_status_idx` ON `check_ins` (`status`);--> statement-breakpoint
CREATE INDEX `check_ins_conversation_status_idx` ON `check_ins` (`conversation_id`,`status`);--> statement-breakpoint
CREATE TABLE `coaching_conversation` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`context_json` text,
	`total_messages` integer DEFAULT 0,
	`total_user_messages` integer DEFAULT 0,
	`total_coach_messages` integer DEFAULT 0,
	`total_check_ins` integer DEFAULT 0,
	`pending_check_ins` integer DEFAULT 0,
	`started_at` integer DEFAULT (unixepoch()),
	`last_message_at` integer DEFAULT (unixepoch()),
	`last_context_update_at` integer
);
--> statement-breakpoint
CREATE TABLE `coaching_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`context_json` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`conversation_id`) REFERENCES `coaching_conversation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `coaching_messages_conversation_id_created_at_idx` ON `coaching_messages` (`conversation_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `active_workout_plan` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`plan_type` text NOT NULL,
	`template_id` text,
	`goals_json` text NOT NULL,
	`progression_json` text NOT NULL,
	`constraints_json` text,
	`current_position_json` text NOT NULL,
	`status` text DEFAULT 'draft',
	`completed_workouts` integer DEFAULT 0,
	`total_scheduled_workouts` integer,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`weeks_json` text,
	`started_at` integer,
	`completed_at` integer,
	`abandoned_at` integer,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `weekly_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_id` text NOT NULL,
	`week_number` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`focus` text,
	`target_workouts` integer NOT NULL,
	`workouts_completed` integer DEFAULT 0,
	`notes` text,
	`workouts_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `weekly_schedules_plan_id_idx` ON `weekly_schedules` (`plan_id`);--> statement-breakpoint
CREATE INDEX `weekly_schedules_plan_week_idx` ON `weekly_schedules` (`plan_id`,`week_number`);--> statement-breakpoint
CREATE TABLE `workout_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_id` text NOT NULL,
	`week_id` text NOT NULL,
	`week_number` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`scheduled_date` text NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`importance` text NOT NULL,
	`goals_json` text,
	`activities_json` text NOT NULL,
	`alternatives_json` text,
	`completed_workout_id` text,
	`rescheduled_to` text,
	`user_notes` text,
	`coach_notes` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `workout_templates_plan_id_idx` ON `workout_templates` (`plan_id`);--> statement-breakpoint
CREATE INDEX `workout_templates_week_id_idx` ON `workout_templates` (`week_id`);--> statement-breakpoint
CREATE INDEX `workout_templates_status_idx` ON `workout_templates` (`status`);--> statement-breakpoint
CREATE INDEX `workout_templates_scheduled_date_idx` ON `workout_templates` (`scheduled_date`);--> statement-breakpoint
CREATE INDEX `workout_templates_plan_week_day_idx` ON `workout_templates` (`plan_id`,`week_number`,`day_of_week`);--> statement-breakpoint
CREATE TABLE `profile` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`bio` text,
	`location` text,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`preferences_json` text,
	`fitness_goals_json` text,
	`training_constraints_json` text,
	`experience_profile_json` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_active_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`current_streak_days` integer DEFAULT 0 NOT NULL,
	`longest_streak_days` integer DEFAULT 0 NOT NULL,
	`last_workout_date` integer,
	`total_workouts_completed` integer DEFAULT 0 NOT NULL,
	`total_minutes_trained` integer DEFAULT 0 NOT NULL,
	`total_volume_kg` integer DEFAULT 0 NOT NULL,
	`total_distance_meters` integer DEFAULT 0 NOT NULL,
	`total_calories_burned` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `profile`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_stats_total_workouts_idx` ON `user_stats` (`total_workouts_completed`);--> statement-breakpoint
CREATE INDEX `user_stats_current_streak_idx` ON `user_stats` (`current_streak_days`);--> statement-breakpoint
CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon_url` text,
	`achievement_type` text NOT NULL,
	`earned_at` integer DEFAULT (unixepoch()) NOT NULL,
	`metadata_json` text,
	FOREIGN KEY (`user_id`) REFERENCES `profile`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `achievements_user_id_idx` ON `achievements` (`user_id`);--> statement-breakpoint
CREATE TABLE `completed_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workout_id` text,
	`plan_id` text,
	`workout_template_id` text,
	`week_number` integer,
	`day_number` integer,
	`workout_type` text NOT NULL,
	`description` text,
	`completed_at` integer NOT NULL,
	`recorded_at` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`notes` text,
	`feeling_rating` integer,
	`percceived_exertion` integer,
	`difficulty_rating` text,
	`performance_json` text,
	`total_volume` integer,
	`distance_meters` integer,
	`calories_burned` integer,
	`verification_json` text,
	`is_public` integer DEFAULT false,
	`multiplayer_session_id` text,
	`heart_rate_data_json` text,
	`gps_data_json` text,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `completed_workouts_user_id_idx` ON `completed_workouts` (`user_id`);--> statement-breakpoint
CREATE INDEX `completed_workouts_completed_at_idx` ON `completed_workouts` (`completed_at`);--> statement-breakpoint
CREATE INDEX `completed_workouts_plan_id_idx` ON `completed_workouts` (`plan_id`);--> statement-breakpoint
CREATE TABLE `workout_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`completed_workout_id` text NOT NULL,
	`activity_type` text NOT NULL,
	`exercise_id` text NOT NULL,
	`exercise_name` text NOT NULL,
	`order_index` integer NOT NULL,
	`sets_json` text,
	`duration_ms` integer,
	`distance_meters` integer,
	`pace_avg` real,
	`heart_rate_avg` integer,
	`hold_duration_seconds` integer,
	`notes` text,
	`completed_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`completed_workout_id`) REFERENCES `completed_workouts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `workout_activities_completed_workout_id_idx` ON `workout_activities` (`completed_workout_id`);--> statement-breakpoint
CREATE TABLE `workout_metadata` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`team_id` text,
	`workout_type` text,
	`completed_at` integer NOT NULL,
	`duration_seconds` integer,
	`distance_meters` integer,
	`calories_burned` integer,
	`total_volume` integer,
	`personal_records` text,
	`feeling_rating` integer,
	`do_user_id` text,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `workout_metadata_user_id_completed_at_idx` ON `workout_metadata` (`user_id`,`completed_at`);--> statement-breakpoint
CREATE INDEX `workout_metadata_team_id_completed_at_idx` ON `workout_metadata` (`team_id`,`completed_at`);--> statement-breakpoint
CREATE INDEX `workout_metadata_completed_at_idx` ON `workout_metadata` (`completed_at`);--> statement-breakpoint
CREATE TABLE `workout_reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`reaction_type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`workout_id`) REFERENCES `completed_workouts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `workout_reactions_workout_id_idx` ON `workout_reactions` (`workout_id`);--> statement-breakpoint
CREATE INDEX `workout_reactions_user_workout_idx` ON `workout_reactions` (`user_id`,`workout_id`);--> statement-breakpoint
CREATE TABLE `connected_services` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`service_type` text NOT NULL,
	`access_token_encrypted` text NOT NULL,
	`refresh_token_encrypted` text,
	`token_expires_at` integer,
	`scope` text,
	`service_user_id` text,
	`permissions` text,
	`sync_status` text,
	`metadata` text,
	`is_active` integer DEFAULT true,
	`is_paused` integer DEFAULT false,
	`connected_at` integer DEFAULT (unixepoch()),
	`last_sync_at` integer,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `connected_services_user_id_service_type_idx` ON `connected_services` (`user_id`,`service_type`);--> statement-breakpoint
CREATE TABLE `integration_sync_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`service_type` text,
	`sync_started_at` integer NOT NULL,
	`sync_completed_at` integer,
	`status` text,
	`workouts_synced_count` integer DEFAULT 0,
	`error_message` text,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE INDEX `integration_sync_log_user_id_idx` ON `integration_sync_log` (`user_id`);