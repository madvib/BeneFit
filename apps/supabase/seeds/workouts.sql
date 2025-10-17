-- Seed data for workouts table
INSERT INTO public.workouts (id, date, type, duration, distance, sets, laps, calories)
VALUES
  (1, '2023-05-01', 'Running', '45 min', '5.2 miles', NULL, NULL, 420),
  (2, '2023-04-29', 'Weight Training', '60 min', NULL, 15, NULL, 380),
  (3, '2023-04-27', 'Cycling', '90 min', '18.5 miles', NULL, NULL, 650),
  (4, '2023-04-25', 'Swimming', '40 min', NULL, NULL, 40, 400),
  (5, '2023-04-23', 'HIIT', '30 min', NULL, NULL, NULL, 320),
  (6, '2023-04-20', 'Yoga', '30 min', NULL, NULL, NULL, 150),
  (7, '2023-04-18', 'Rowing', '45 min', '5.0 km', NULL, NULL, 380);