/*
  # Add Email Notification Trigger

  1. Changes
    - Creates a trigger function that calls the send-lead-email edge function
    - Adds a trigger on leads table to automatically send emails on new inserts
  
  2. Notes
    - Email notifications will be sent to:
      - call@terravto.ru
      - a.bliznyukov@terravto.ru
      - n.pastyreva@geely-pragmatika.ru
    - Uses Supabase Edge Function for email delivery
*/

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lead_created ON leads;

CREATE TRIGGER on_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();
