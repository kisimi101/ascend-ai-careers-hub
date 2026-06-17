
-- Onboarding email tracking + resume skills indexing
CREATE TABLE public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'sent',
  meta jsonb,
  UNIQUE(user_id, email_type)
);

GRANT SELECT ON public.email_log TO authenticated;
GRANT ALL ON public.email_log TO service_role;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email log"
  ON public.email_log FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_email_log_user_type ON public.email_log(user_id, email_type);

-- Latest resume skills stored on profile for cross-tool reuse
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS latest_resume_skills jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS latest_resume_updated_at timestamptz;
