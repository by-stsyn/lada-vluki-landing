/*
  # Create leads table for Geely dealership

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, required) - Customer name
      - `phone` (text, required) - Customer phone number
      - `lead_type` (text, required) - Type of lead: general, test_drive, credit
      - `model` (text, optional) - Car model for test drive
      - `preferred_date` (date, optional) - Preferred date for test drive
      - `created_at` (timestamptz) - When the lead was created
      
  2. Security
    - Enable RLS on `leads` table
    - Add policy for inserting leads (public access for form submissions)
    - Add policy for authenticated users to view all leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  lead_type text NOT NULL CHECK (lead_type IN ('general', 'test_drive', 'credit')),
  model text,
  preferred_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);