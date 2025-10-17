-- Seed data for goals table
INSERT INTO public.goals (id, title, description, target_value, current_value, unit, deadline, status)
VALUES
  (1, 'Run 50 miles', 'Complete 50 miles of running this month', 50, 32.5, 'miles', '2023-05-31', 'active'),
  (2, 'Strength Training', 'Complete 20 strength sessions this month', 20, 14, 'sessions', '2023-05-31', 'active'),
  (3, 'Couch to 5K', 'Complete the Couch to 5K program', 9, 9, 'weeks', '2023-04-15', 'completed'),
  (4, 'Daily Steps', 'Walk 10,000 steps per day', 10000, 8542, 'steps/day', '2023-05-31', 'active');