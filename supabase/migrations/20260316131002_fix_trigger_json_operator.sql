/*
  # Fix Trigger JSON Operator Error

  1. Changes
    - Fixes the JSON operator issue in the email notification trigger
    - Uses proper vault and pg_net extension for secure API calls
    - Ensures trigger works correctly with request headers

  2. Notes
    - Requires pg_net extension for HTTP requests
    - Uses Supabase's built-in secrets management
*/

-- Ensure pg_net extension is enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_lead_created ON leads;
DROP FUNCTION IF EXISTS notify_new_lead();

-- Recreate the function with proper JSON handling
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  project_url text;
  anon_key text;
  request_id bigint;
BEGIN
  -- Get Supabase project URL from environment
  SELECT decrypted_secret INTO project_url 
  FROM vault.decrypted_secrets 
  WHERE name = 'SUPABASE_URL' 
  LIMIT 1;
  
  -- Get anon key from environment
  SELECT decrypted_secret INTO anon_key 
  FROM vault.decrypted_secrets 
  WHERE name = 'SUPABASE_ANON_KEY' 
  LIMIT 1;
  
  -- Fallback to deriving URL from current settings if vault is not available
  IF project_url IS NULL THEN
    project_url := current_setting('request.jwt.claims', true)::json->>'iss';
  END IF;
  
  -- Make async HTTP request to edge function
  SELECT net.http_post(
    url := project_url || '/functions/v1/send-lead-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(anon_key, '')
    ),
    body := jsonb_build_object(
      'name', NEW.name,
      'phone', NEW.phone,
      'lead_type', NEW.lead_type,
      'model', NEW.model,
      'preferred_date', NEW.preferred_date,
      'created_at', NEW.created_at
    )
  ) INTO request_id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send email notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();
