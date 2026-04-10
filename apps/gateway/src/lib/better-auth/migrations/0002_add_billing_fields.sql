ALTER TABLE `user` ADD `stripe_customer_id` text;
--> statement-breakpoint
ALTER TABLE `user` ADD `subscription_plan` text DEFAULT 'free';
--> statement-breakpoint
ALTER TABLE `user` ADD `subscription_status` text DEFAULT 'none';
