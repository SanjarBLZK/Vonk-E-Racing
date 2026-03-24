-- Voeg onze circuits toe aan de database
-- Deze query moet worden uitgevoerd in de Supabase SQL Editor

-- Voeg de circuits toe
INSERT INTO circuits (id, name, location, country, length_in_meters, number_of_corners, fastest_lap_time, fastest_lap_driver, description, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Zwolle', 'Zwolle', 'Nederland', 1200, 12, 42.3, '', 'Een technisch circuit in Zwolle', 'https://i.imgur.com/zZTd4lG.jpeg'),
('550e8400-e29b-41d4-a716-446655440002', 'Lelystad', 'Lelystad', 'Nederland', 1100, 10, 41.8, '', 'Een snel circuit in Lelystad', 'https://imgur.com/fAQ1d9q.jpeg'),
('550e8400-e29b-41d4-a716-446655440003', 'Venray', 'Venray', 'Nederland', 1300, 14, 43.1, '', 'Een uitdagend circuit in Venray', 'https://imgur.com/bxM9I1s.jpg')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  country = EXCLUDED.country,
  length_in_meters = EXCLUDED.length_in_meters,
  number_of_corners = EXCLUDED.number_of_corners,
  fastest_lap_time = EXCLUDED.fastest_lap_time,
  fastest_lap_driver = EXCLUDED.fastest_lap_driver,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Voeg een race toe voor elk circuit (nodig voor lap times en tire pressure)
INSERT INTO races (id, circuit_id, name, race_date, race_type, weather_condition, temperature_celsius, track_condition, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Zwolle Practice', '2026-03-23 10:00:00', 'practice', 'Sunny', 18, 'Dry', 'completed'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Lelystad Practice', '2026-03-23 10:00:00', 'practice', 'Sunny', 18, 'Dry', 'completed'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Venray Practice', '2026-03-23 10:00:00', 'practice', 'Sunny', 18, 'Dry', 'completed')
ON CONFLICT (id) DO UPDATE SET
  circuit_id = EXCLUDED.circuit_id,
  name = EXCLUDED.name,
  race_date = EXCLUDED.race_date,
  race_type = EXCLUDED.race_type,
  weather_condition = EXCLUDED.weather_condition,
  temperature_celsius = EXCLUDED.temperature_celsius,
  track_condition = EXCLUDED.track_condition,
  status = EXCLUDED.status;

-- Voeg een team toe (nodig voor race participants)
INSERT INTO teams (id, name, team_number, description) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Default Team', 999, 'Standaard team voor races')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  team_number = EXCLUDED.team_number,
  description = EXCLUDED.description;

-- Voeg een user toe (nodig voor race participants)
INSERT INTO users (id, email, username, password_hash, first_name, last_name) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'driver@racing.com', 'driver', 'temp_hash', 'Race', 'Driver')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Voeg race participants toe (nodig voor lap times en tire pressure)
INSERT INTO race_participants (id, race_id, team_id, car_number, driver_id, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '12', '880e8400-e29b-41d4-a716-446655440001', 'registered'),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '12', '880e8400-e29b-41d4-a716-446655440001', 'registered'),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '12', '880e8400-e29b-41d4-a716-446655440001', 'registered')
ON CONFLICT (id) DO UPDATE SET
  race_id = EXCLUDED.race_id,
  team_id = EXCLUDED.team_id,
  car_number = EXCLUDED.car_number,
  driver_id = EXCLUDED.driver_id,
  status = EXCLUDED.status;
