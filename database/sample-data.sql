-- Sample data for Racing App Database
-- Run this in Supabase SQL Editor to populate with realistic data

-- Insert more users
INSERT INTO users (id, email, username, password_hash, first_name, last_name, phone, date_of_birth) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'jan.devries@racingteam.nl', 'jandevries', 'hashed_password_1', 'Jan', 'de Vries', '06-12345678', '1990-05-15'),
('550e8400-e29b-41d4-a716-446655440001', 'pieter.jansen@racingteam.nl', 'pieterjansen', 'hashed_password_2', 'Pieter', 'Jansen', '06-23456789', '1992-08-22'),
('550e8400-e29b-41d4-a716-446655440002', 'klaas.bakker@racingteam.nl', 'klaasbakker', 'hashed_password_3', 'Klaas', 'Bakker', '06-34567890', '1991-12-03'),
('550e8400-e29b-41d4-a716-446655440003', 'erik.visser@racingteam.nl', 'erikvisser', 'hashed_password_4', 'Erik', 'Visser', '06-45678901', '1993-07-18'),
('550e8400-e29b-41d4-a716-446655440004', 'martijn.smit@racingteam.nl', 'martijnsmit', 'hashed_password_5', 'Martijn', 'Smit', '06-56789012', '1994-03-28'),
('550e8400-e29b-41d4-a716-446655440005', 'thomas.mulder@racingteam.nl', 'thomasmulder', 'hashed_password_6', 'Thomas', 'Mulder', '06-67890123', '1992-11-10'),
('550e8400-e29b-41d4-a716-446655440006', 'wim.deboer@racingteam.nl', 'wimdeboer', 'hashed_password_7', 'Wim', 'de Boer', '06-78901234', '1995-06-14');

-- Insert teams
INSERT INTO teams (id, name, team_number, description) VALUES
('550e8400-e29b-41d4-a716-446655441000', 'Lightning Racers', 10, 'Professional racing team specializing in circuit racing'),
('550e8400-e29b-41d4-a716-446655441001', 'Thunder Bolts', 11, 'High-performance racing team with focus on endurance events'),
('550e8400-e29b-41d4-a716-446655441002', 'Speed Demons', 12, 'Aggressive racing team known for fast lap times');

-- Insert team members with roles
INSERT INTO team_members (user_id, team_id, role_id, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655441000', (SELECT id FROM roles WHERE role_key = 'docent'), true),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655441000', (SELECT id FROM roles WHERE role_key = 'teamleider'), true),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655441000', (SELECT id FROM roles WHERE role_key = 'coureur'), true),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655441000', (SELECT id FROM roles WHERE role_key = 'monteur'), true),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655441000', (SELECT id FROM roles WHERE role_key = 'pr_manager'), false), -- PR manager is inactive
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655441000', (SELECT id FROM roles WHERE role_key = 'financieel_manager'), true),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655441000', (SELECT id FROM roles WHERE role_key = 'baanmarshall'), true);

-- Insert more circuits with Dutch tracks
INSERT INTO circuits (name, location, country, length_in_meters, number_of_corners, fastest_lap_time, fastest_lap_driver, description, image_url) VALUES
('Circuit Zandvoort', 'Zandvoort', 'Netherlands', 4259.0, 14, 72.341, 'Max Verstappen', 'Historisch F1 circuit langs de Nederlandse kust', 'https://example.com/zandvoort.jpg'),
('TT Circuit Assen', 'Assen', 'Netherlands', 4555.0, 18, 65.234, 'Michele Pirro', 'Beroemde motorrace circuit in Drenthe', 'https://example.com/assen.jpg'),
('Circuit Park Zolder', 'Heusden-Zolder', 'Belgium', 4004.0, 13, 68.912, 'Lewis Hamilton', 'Belgisch circuit met technische uitdagingen', 'https://example.com/zolder.jpg'),
('Nürburgring Nordschleife', 'Nürburg', 'Germany', 22835.0, 154, 415.678, 'Stefan Bellof', 'De groene hel van de Nürburg', 'https://example.com/nurburgring.jpg'),
('Circuit de Barcelona-Catalunya', 'Montmeló', 'Spain', 4657.0, 16, 70.890, 'Max Verstappen', 'Spaans F1 circuit nabij Barcelona', 'https://example.com/barcelona.jpg');

-- Insert races for current season
INSERT INTO races (id, circuit_id, name, race_date, race_type, weather_condition, temperature_celsius, track_condition, status) VALUES
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM circuits WHERE name = 'Circuit Zandvoort'), 'Dutch Grand Prix', '2026-04-15 14:00:00', 'race', 'Sunny', 18, 'Dry', 'completed'),
('550e8400-e29b-41d4-a716-446655440011', (SELECT id FROM circuits WHERE name = 'TT Circuit Assen'), 'Assen MotoGP', '2026-04-22 13:00:00', 'race', 'Cloudy', 15, 'Damp', 'completed'),
('550e8400-e29b-41d4-a716-446655440012', (SELECT id FROM circuits WHERE name = 'Circuit Park Zolder'), 'Belgian Endurance Race', '2026-05-10 16:00:00', 'race', 'Overcast', 12, 'Wet', 'completed'),
('550e8400-e29b-41d4-a716-446655440013', (SELECT id FROM circuits WHERE name = 'Nürburgring Nordschleife'), 'Nürburgring 24H', '2026-06-01 10:00:00', 'race', 'Rainy', 8, 'Wet', 'in_progress'),
('550e8400-e29b-41d4-a716-446655440014', (SELECT id FROM circuits WHERE name = 'Circuit de Barcelona-Catalunya'), 'Spanish Test Day', '2026-06-15 09:00:00', 'practice', 'Sunny', 22, 'Dry', 'scheduled');

-- Insert race participants with explicit IDs
INSERT INTO race_participants (id, race_id, team_id, car_number, driver_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655441000', 1, '550e8400-e29b-41d4-a716-446655440002', 'finished'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655441001', 7, '550e8400-e29b-41d4-a716-446655440003', 'finished'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655441002', 12, '550e8400-e29b-41d4-a716-446655440006', 'dnf'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655441000', 1, '550e8400-e29b-41d4-a716-446655440002', 'finished'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655441001', 7, '550e8400-e29b-41d4-a716-446655440003', 'finished'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655441002', 12, '550e8400-e29b-41d4-a716-446655440006', 'finished');

-- Insert realistic lap times
INSERT INTO lap_times (race_participant_id, lap_number, lap_time_seconds, sector1_time_seconds, sector2_time_seconds, sector3_time_seconds, is_fastest_lap) VALUES
-- Dutch Grand Prix - Lightning Racers
('550e8400-e29b-41d4-a716-446655440020', 1, 75.234, 25.123, 24.567, 25.544, false),
('550e8400-e29b-41d4-a716-446655440020', 2, 73.456, 24.234, 24.123, 25.099, false),
('550e8400-e29b-41d4-a716-446655440020', 3, 72.341, 23.890, 24.123, 24.328, true),
('550e8400-e29b-41d4-a716-446655440020', 4, 73.678, 24.456, 24.234, 24.988, false),
-- Dutch Grand Prix - Thunder Bolts
('550e8400-e29b-41d4-a716-446655440021', 1, 76.123, 25.234, 25.123, 25.766, false),
('550e8400-e29b-41d4-a716-446655440021', 2, 74.567, 24.890, 24.678, 24.999, false),
('550e8400-e29b-41d4-a716-446655440021', 3, 73.234, 24.123, 24.456, 24.655, true);

-- Insert tire pressure data
INSERT INTO tire_pressure (race_participant_id, measurement_time, front_left_psi, front_right_psi, rear_left_psi, rear_right_psi, tire_temperature_celsius, notes) VALUES
('550e8400-e29b-41d4-a716-446655440020', '2026-04-15 13:45:00', 23.5, 23.7, 22.8, 23.1, 85.2, 'Pre-race setup'),
('550e8400-e29b-41d4-a716-446655440020', '2026-04-15 14:30:00', 24.1, 24.3, 23.2, 23.8, 92.5, 'After lap 2'),
('550e8400-e29b-41d4-a716-446655440020', '2026-04-15 15:15:00', 23.8, 24.0, 22.9, 23.2, 88.7, 'After lap 4');

-- Insert pit stop data
INSERT INTO pit_stops (race_participant_id, lap_number, pit_in_time, pit_out_time, total_duration_seconds, pit_stop_type, notes) VALUES
('550e8400-e29b-41d4-a716-446655440020', 8, '2026-04-15 15:45:30', '2026-04-15 15:48:15', 165.0, 'tire_change', 'Front tires changed'),
('550e8400-e29b-41d4-a716-446655440021', 12, '2026-04-15 16:20:45', '2026-04-15 16:24:30', 225.0, 'tire_change', 'All four tires + fuel'),
('550e8400-e29b-41d4-a716-446655440020', 18, '2026-04-15 17:10:20', '2026-04-15 17:12:50', 150.0, 'fuel', 'Quick fuel stop');

-- Insert agenda events
INSERT INTO agenda_events (team_id, title, description, event_type, start_time, end_time, location, created_by) VALUES
('550e8400-e29b-41d4-a716-446655441000', 'Team Meeting', 'Weekly team meeting to discuss race strategy', 'meeting', '2026-03-20 10:00:00', '2026-03-20 11:30:00', 'Team Room', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655441000', 'Practice Session Zandvoort', 'Full day practice at Zandvoort circuit', 'practice', '2026-03-25 09:00:00', '2026-03-25 17:00:00', 'Circuit Zandvoort', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655441001', 'Sponsor Meeting', 'Meeting with TechCorp to discuss sponsorship renewal', 'sponsor_event', '2026-03-22 14:00:00', '2026-03-22 16:00:00', 'TechCorp Office', '550e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655441002', 'Car Maintenance', 'Regular maintenance check for race cars', 'maintenance', '2026-03-18 13:00:00', '2026-03-18 17:00:00', 'Garage', '550e8400-e29b-41d4-a716-446655440003');

-- Insert safety tests (docent responsibility)
INSERT INTO safety_tests (user_id, test_date, test_type, score, max_score, passed, tested_by, notes) VALUES
('550e8400-e29b-41d4-a716-446655440002', '2026-03-01 10:00:00', 'written', 85.0, 100.0, true, '550e8400-e29b-41d4-a716-446655440000', 'Written safety test passed'),
('550e8400-e29b-41d4-a716-446655440003', '2026-03-02 14:00:00', 'practical', 92.0, 100.0, true, '550e8400-e29b-41d4-a716-446655440000', 'Practical driving test completed'),
('550e8400-e29b-41d4-a716-446655440006', '2026-03-03 11:00:00', 'refresher', 88.0, 100.0, true, '550e8400-e29b-41d4-a716-446655440000', 'Annual refresher course');

-- Insert insurance documents
INSERT INTO insurance_documents (team_id, document_type, policy_number, insurance_company, start_date, end_date, is_active) VALUES
('550e8400-e29b-41d4-a716-446655441000', 'liability', 'LR-2026-001', 'Racing Insurance BV', '2026-01-01', '2026-12-31', true),
('550e8400-e29b-41d4-a716-446655441000', 'vehicle', 'LR-2026-002', 'AutoVerzekering NL', '2026-01-01', '2026-12-31', true),
('550e8400-e29b-41d4-a716-446655441001', 'liability', 'TB-2026-001', 'RaceCover Insurance', '2026-01-01', '2026-12-31', true),
('550e8400-e29b-41d4-a716-446655441002', 'vehicle', 'SD-2026-001', 'FastTrack Insurance', '2026-01-01', '2026-12-31', true);

-- Insert financial records (financieel manager responsibility)
INSERT INTO financial_records (team_id, record_type, category, description, amount, currency, date, created_by) VALUES
('550e8400-e29b-41d4-a716-446655441000', 'expense', 'Car Parts', 'New set of racing tires', -1500.00, 'EUR', '2026-03-15', '550e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655441000', 'expense', 'Travel', 'Hotel accommodation Zandvoort', -450.00, 'EUR', '2026-03-20', '550e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655441000', 'income', 'Sponsorship', 'TechCorp Q1 sponsorship', 5000.00, 'EUR', '2026-04-01', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655441001', 'expense', 'Car Parts', 'Engine rebuild', -3500.00, 'EUR', '2026-03-10', '550e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655441001', 'income', 'Sponsorship', 'ElectroPower annual funding', 10000.00, 'EUR', '2026-01-15', '550e8400-e29b-41d4-a716-446655440005');

-- Insert sponsors (PR manager responsibility)
INSERT INTO sponsors (team_id, sponsor_name, contact_person, email, phone, sponsorship_amount, sponsorship_type, start_date, end_date, is_active, notes) VALUES
('550e8400-e29b-41d4-a716-446655441000', 'TechCorp', 'John Smith', 'john.smith@techcorp.nl', '06-12345678', 5000.00, 'financial', '2026-01-01', '2026-12-31', true, 'Primary sponsor for racing season'),
('550e8400-e29b-41d4-a716-446655441000', 'RacingGear', 'Maria Johnson', 'maria@racinggear.com', '06-23456789', 1500.00, 'equipment', '2026-03-01', '2026-12-31', true, 'Equipment supplier'),
('550e8400-e29b-41d4-a716-446655441001', 'ElectroPower', 'Peter Wilson', 'peter@electropower.nl', '06-34567890', 10000.00, 'financial', '2026-01-01', '2026-12-31', true, 'Main sponsor'),
('550e8400-e29b-41d4-a716-446655441002', 'Velocity Inc', 'Sarah Davis', 'sarah@velocity.com', '06-45678901', 7500.00, 'financial', '2026-02-01', '2026-12-31', true, 'Secondary sponsor');

-- Update circuit fastest laps based on inserted data
UPDATE circuits SET 
  fastest_lap_time = 72.341,
  fastest_lap_driver = 'Klaas Bakker'
WHERE name = 'Circuit Zandvoort';

-- Update circuits with realistic lap times
UPDATE circuits SET 
  fastest_lap_time = 65.234,
  fastest_lap_driver = 'Pieter Jansen'
WHERE name = 'TT Circuit Assen';

UPDATE circuits SET 
  fastest_lap_time = 68.912,
  fastest_lap_driver = 'Erik Visser'
WHERE name = 'Circuit Park Zolder';
