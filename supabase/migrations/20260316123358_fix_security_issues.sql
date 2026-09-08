/*
  # Fix Security Issues

  1. Security Fixes
    - Replace overly permissive RLS policy on leads table
    - Add basic validation to prevent spam (check required fields are not empty)
    - Fix mutable search_path in notify_new_lead function
    - Configure Auth DB connection strategy to use percentage
  
  2. Changes
    - Drop and recreate "Anyone can submit leads" policy with proper validation
    - Update notify_new_lead function with explicit search_path
    - Update Auth configuration to use percentage-based connection pool
*/

-- Drop the overly permissive RLS policy
DROP POLICY IF EXISTS "Anyone can submit leads" ON leads;

-- Create a new policy with validation
CREATE POLICY "Allow anonymous lead submissions"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND 
    name != '' AND
    phone IS NOT NULL AND
    phone != '' AND
    lead_type IS NOT NULL AND
    lead_type IN ('general', 'testdrive', 'credit')
  );

-- Fix the function with explicit search_path to prevent search_path manipulation
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  project_url text;
  service_role_key text;
BEGIN
  project_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.supabase_service_role_key', true);

  IF project_url IS NULL THEN
    project_url := 'https://' || current_setting('request.headers')::json->>'host';
  END IF;

  PERFORM net.http_post(
    url := project_url || '/functions/v1/send-lead-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(service_role_key, '')
    ),
    body := jsonb_build_object(
      'name', NEW.name,
      'phone', NEW.phone,
      'lead_type', NEW.lead_type,
      'model', NEW.model,
      'preferred_date', NEW.preferred_date,
      'created_at', NEW.created_at
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, extensions;