-- Seed data for recommendations table
INSERT INTO public.recommendations (id, title, description, category)
VALUES
  (1, 'Try HIIT Training', 'Based on your running progress, incorporating HIIT sessions could help improve your endurance.', 'Workout'),
  (2, 'Hydration Check', 'Your recent activities show you might need to increase water intake during long runs.', 'Nutrition'),
  (3, 'Sleep Optimization', 'To support your recovery, aim for 7-9 hours of sleep, especially on days with intense training.', 'Wellness'),
  (4, '30-Day Plank Challenge', 'Build core strength', 'Core'),
  (5, 'Yoga 3x/Week', 'Improve flexibility', 'Flexibility'),
  (6, 'Hydration Tracking', 'Drink 8 glasses daily', 'Wellness');