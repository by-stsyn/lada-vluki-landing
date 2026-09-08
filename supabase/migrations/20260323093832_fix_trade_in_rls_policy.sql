/*
  # Fix RLS Policy for Trade-In Leads

  1. Changes
    - Drops the restrictive RLS policy that was checking lead_type values
    - Creates a new simpler policy that allows all valid lead submissions
    - Relies on CHECK constraint for data validation instead of RLS

  2. Security
    - Maintains protection against empty submissions
    - Allows anonymous users to submit leads (necessary for public forms)
    - CHECK constraint ensures only valid lead_type values
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Allow anonymous lead submissions" ON leads;

-- Create a new simpler policy for insertions
CREATE POLICY "Anyone can submit leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND name <> '' AND
    phone IS NOT NULL AND phone <> '' AND
    lead_type IS NOT NULL
  );
