
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fn_url text := 'https://jpsixrrcftxctghpzuhj.supabase.co/functions/v1/send-onboarding-email';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwc2l4cnJjZnR4Y3RnaHB6dWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjg5ODEsImV4cCI6MjA3ODIwNDk4MX0.a1vfCuIWKDn2IuBMZTnztoYemWfevxksARs0sYFCnGE';
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);

  -- Fire immediate welcome email (best-effort; ignore failures so signup never breaks)
  BEGIN
    PERFORM net.http_post(
      url := fn_url,
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||anon_key,'apikey',anon_key),
      body := jsonb_build_object('userId', new.id, 'type', 'welcome')
    );
  EXCEPTION WHEN OTHERS THEN
    -- swallow
    NULL;
  END;

  RETURN new;
END;
$$;
