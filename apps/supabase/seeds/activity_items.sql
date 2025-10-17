-- Seed data for activity_items table
INSERT INTO public.activity_items (id, type, title, description, timestamp, "user", avatar, duration, calories, "value", goal)
VALUES
  (1, 'workout', 'Completed 5K Run', 'Great pace today! Finished with a new personal best time.', '2023-05-10T09:00:00.000Z', 'Alex Johnson', 'https://randomuser.me/api/portraits/men/32.jpg', '28:45', NULL, NULL, NULL),
  (2, 'nutrition', 'Lunch Added', 'Grilled chicken salad with vegetables', '2023-05-10T08:00:00.000Z', 'Sarah Miller', 'https://randomuser.me/api/portraits/women/44.jpg', NULL, 420, NULL, NULL),
  (3, 'goal', 'New Goal Set', 'Run 50 miles this month', '2023-05-09T10:00:00.000Z', 'Mike Thompson', 'https://randomuser.me/api/portraits/men/22.jpg', NULL, NULL, 12, 50),
  (4, 'achievement', 'Milestone Reached', 'Congratulations on completing 30 consecutive days of exercise!', '2023-05-08T10:00:00.000Z', 'You', 'https://randomuser.me/api/portraits/men/97.jpg', NULL, NULL, NULL, NULL),
  (5, 'progress', 'Weight Loss Progress', 'Lost 2 lbs this week', '2023-05-07T10:00:00.000Z', 'Emma Davis', 'https://randomuser.me/api/portraits/women/68.jpg', NULL, NULL, 2, NULL);