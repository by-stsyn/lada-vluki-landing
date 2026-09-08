/*
  # Add Trade-In Lead Type

  1. Changes
    - Updates the CHECK constraint on leads.lead_type to include 'trade-in'
    - Allows forms to submit trade-in requests

  2. Security
    - No changes to RLS policies
    - Maintains existing security model
*/

-- Drop the existing constraint
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_lead_type_check;

-- Add the updated constraint with 'trade-in' included
ALTER TABLE leads ADD CONSTRAINT leads_lead_type_check 
  CHECK (lead_type IN ('general', 'test_drive', 'credit', 'trade-in'));
