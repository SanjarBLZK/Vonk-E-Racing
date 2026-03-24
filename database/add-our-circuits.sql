-- Voeg onze circuits toe aan de database
-- Deze query moet worden uitgevoerd in de Supabase SQL Editor

-- Voeg de circuits toe
INSERT INTO circuits (id, name, location, country, length_in_meters, number_of_corners, fastest_lap_time, fastest_lap_driver, description, image_url) VALUES
('zwolle', 'Zwolle', 'Zwolle', 'Nederland', 1200, 12, 42.3, '', 'Een technisch circuit in Zwolle', 'https://i.imgur.com/zZTd4lG.jpeg'),
('lelystad', 'Lelystad', 'Lelystad', 'Nederland', 1100, 10, 41.8, '', 'Een snel circuit in Lelystad', 'https://imgur.com/fAQ1d9q.jpeg'),
('venray', 'Venray', 'Venray', 'Nederland', 1300, 14, 43.1, '', 'Een uitdagend circuit in Venray', 'https://imgur.com/bxM9I1s.jpg')
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
('race-zwolle-1', 'zwolle', 'Zwolle Practice', '2026-03-23 10:00:00', 'practice', 'Sunny', 18, 'Dry', 'completed'),
('race-lelystad-1', 'lelystad', 'Lelystad Practice', '2026-03-23 10:00:00', 'practice', 'Sunny', 18, 'Dry', 'completed'),
('race-venray-1', 'venray', 'Venray Practice', '2026-03-23 10:00:00', 'practice', 'Sunny', 18, 'Dry', 'completed')
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
('team-default', 'Default Team', 1, 'Standaard team voor races')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  team_number = EXCLUDED.team_number,
  description = EXCLUDED.description;

-- Voeg een user toe (nodig voor race participants)
INSERT INTO users (id, email, username, password_hash, first_name, last_name) VALUES
('user-default', 'driver@racing.com', 'driver', 'temp_hash', 'Race', 'Driver')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Voeg race participants toe (nodig voor lap times en tire pressure)
INSERT INTO race_participants (id, race_id, team_id, car_number, driver_id, status) VALUES
('participant-zwolle-12', 'race-zwolle-1', 'team-default', '12', 'user-default', 'active'),
('participant-lelystad-12', 'race-lelystad-1', 'team-default', '12', 'user-default', 'active'),
('participant-venray-12', 'race-venray-1', 'team-default', '12', 'user-default', 'active')
ON CONFLICT (id) DO UPDATE SET
  race_id = EXCLUDED.race_id,
  team_id = EXCLUDED.team_id,
  car_number = EXCLUDED.car_number,
  driver_id = EXCLUDED.driver_id,
  status = EXCLUDED.status;
