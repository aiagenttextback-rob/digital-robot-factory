-- Seed Initial San Diego Plumbing Contractors for Pilot
INSERT INTO contractors (business_name, owner_name, phone, email, target_zipcodes, active)
VALUES 
  ('La Jolla Coastal Plumbing', 'Mike Ross', '+16195550101', 'mike@lajollaplumbing.com', ARRAY['92037', '92014'], true),
  ('Crown City Plumbing Coronado', 'Sarah Jenkins', '+16195550102', 'sarah@coronadoplumbing.com', ARRAY['92118'], true)
ON CONFLICT (phone) DO NOTHING;
