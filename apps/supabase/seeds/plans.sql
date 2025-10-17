-- Seed data for plans table
INSERT INTO public.plans (id, name, description, duration, difficulty, category, progress)
VALUES
  (1, '30-Day Strength Building', 'A comprehensive strength training program designed for intermediate users', '4 weeks', 'Intermediate', 'Strength', 65);

-- Seed data for workout_plans table
INSERT INTO public.workout_plans (id, "day", date, exercise, sets, reps, duration, completed)
VALUES
  (1, 'Mon', '2023-05-06', 'Chest & Triceps', 4, 12, NULL, true),
  (2, 'Tue', '2023-05-07', 'Back & Biceps', 4, 12, NULL, true),
  (3, 'Wed', '2023-05-08', 'Legs Day', 5, 10, NULL, false),
  (4, 'Thu', '2023-05-09', 'Shoulders & Abs', 3, 15, NULL, false),
  (5, 'Fri', '2023-05-10', 'Full Body', 4, 10, NULL, false),
  (6, 'Sat', '2023-05-11', 'Rest or Light Cardio', 0, 0, '20-30 min', false),
  (7, 'Sun', '2023-05-12', 'Rest', 0, 0, NULL, false);

-- Seed data for plan_suggestions table
INSERT INTO public.plan_suggestions (id, name, difficulty, duration, category)
VALUES
  (1, 'Beginner Full Body', 'Beginner', '6 weeks', 'Strength'),
  (2, 'HIIT Cardio Blast', 'Intermediate', '4 weeks', 'Cardio'),
  (3, 'Yoga Flexibility', 'Beginner', '8 weeks', 'Flexibility'),
  (4, 'Advanced Powerlifting', 'Advanced', '12 weeks', 'Strength');