/*
  # Remove Problematic Email Trigger

  1. Changes
    - Drops the email notification trigger that is causing database errors
    - Keeps the leads table fully functional
    - Forms will work correctly without automatic email notifications

  2. Notes
    - Email notifications can be implemented later using a different approach
    - All lead data will still be saved to the database
    - No data loss, just removes the broken trigger
*/

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_lead_created ON public.leads;

-- Drop the function
DROP FUNCTION IF EXISTS public.notify_new_lead() CASCADE;
