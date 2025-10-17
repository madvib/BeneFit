-- Seed data for messages table
INSERT INTO public.messages (id, content, sender, "timestamp")
VALUES
  (1, 'Hi! How can I help you with your fitness journey today?', 'coach', '2023-05-10 10:15:00'),
  (2, 'I''m having trouble with my running form. Any tips?', 'user', '2023-05-10 10:16:00'),
  (3, 'Certainly! Focus on keeping your shoulders relaxed, landing mid-foot, and maintaining a steady cadence around 170-180 steps per minute.', 'coach', '2023-05-10 10:17:00'),
  (4, 'That sounds helpful. Should I be concerned about my pace?', 'user', '2023-05-10 10:18:00'),
  (5, 'Pace is important, but form comes first. Once your technique is solid, you can work on speed. Consistency in your training is key!', 'coach', '2023-05-10 10:19:00');

-- Seed data for chats table
INSERT INTO public.chats (id, title, last_message, "timestamp", unread)
VALUES
  (1, 'Post-Workout Recovery', 'Try light stretching and 8oz of water', '2023-05-10 10:24:00', false),
  (2, 'Nutrition Plan', 'Increase protein for muscle recovery', '2023-05-09 14:30:00', true),
  (3, 'Running Technique', 'Focus on cadence: aim for 170-180 steps/min', '2023-05-08 09:15:00', false),
  (4, 'Goal Progress', 'You''re ahead of your plan! Keep going!', '2023-05-05 16:45:00', false),
  (5, 'Sleep Optimization', 'Aim for 7-9 hours for better recovery', '2023-05-03 20:30:00', false);