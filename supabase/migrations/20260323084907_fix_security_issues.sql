/*
  # Fix Security Issues

  1. Security Fixes
    - Fix function `notify_new_lead` to use immutable search_path
    - This prevents potential SQL injection attacks by locking down the search path

  2. Notes
    - The search_path is set to an empty string with pg_catalog and pg_temp
    - This ensures the function only uses fully qualified names and built-in PostgreSQL functions
    - Auth DB connection strategy issue needs to be fixed in Supabase dashboard settings
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS public.notify_new_lead() CASCADE;

-- Recreate the function with proper search_path security
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  project_url text;
  service_role_key text;
BEGIN
  -- Get configuration settings
  project_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.supabase_service_role_key', true);

  -- Fallback to request headers if not set
  IF project_url IS NULL THEN
    project_url := 'https://' || current_setting('request.headers', true)::json->>'host';
  END IF;

  -- Call the edge function using the extensions schema
  PERFORM extensions.http_post(
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
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_lead_created ON public.leads;

CREATE TRIGGER on_lead_created
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_lead();
