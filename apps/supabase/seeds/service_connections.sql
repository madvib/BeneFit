-- Seed data for service_connections table
INSERT INTO public.service_connections (id, name, description, connected, logo, last_sync, data_type)
VALUES
  (1, 'Apple Health', 'Sync your health and fitness data from Apple devices', true, '/connection_logos/icons8-apple-fitness-48.png', NOW(), ARRAY['Steps', 'Heart Rate', 'Sleep', 'Workouts']),
  (2, 'Strava', 'Connect your Strava account to import activities', true, '/connection_logos/strava-svgrepo-com.svg', NOW() - INTERVAL '2 hours', ARRAY['Running', 'Cycling', 'Swimming']),
  (3, 'Google Fit', 'Import fitness data from Google Fit', false, '/connection_logos/google-fit-svgrepo-com.svg', NULL, ARRAY['Steps', 'Heart Rate', 'Workouts', 'Weight']),
  (4, 'Fitbit', 'Connect your Fitbit to sync health data', false, 'https://logos-world.net/wp-content/uploads/2021/02/Fitbit-Logo.png', NULL, ARRAY['Steps', 'Sleep', 'Heart Rate', 'Calories']),
  (5, 'WHOOP', 'Connect your WHOOP strap for recovery insights', false, 'https://logos-world.net/wp-content/uploads/2022/11/WHOOP-Logo.png', NULL, ARRAY['Recovery', 'Strain', 'Sleep', 'Workouts']);