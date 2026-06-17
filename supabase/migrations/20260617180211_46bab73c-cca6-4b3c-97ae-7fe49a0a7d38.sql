
REVOKE EXECUTE ON FUNCTION public._dispatch_onboarding_email(uuid, text, jsonb) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.run_onboarding_drip() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.run_weekly_job_matches() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.run_application_followups() FROM anon, authenticated, PUBLIC;
