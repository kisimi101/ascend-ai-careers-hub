
-- Company watchlist
CREATE TABLE public.company_watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  keywords text,
  location text,
  last_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_name)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_watchlist TO authenticated;
GRANT ALL ON public.company_watchlist TO service_role;

ALTER TABLE public.company_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own watchlist"
  ON public.company_watchlist FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_company_watchlist_updated_at
  BEFORE UPDATE ON public.company_watchlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_company_watchlist_user ON public.company_watchlist(user_id);

-- Job snapshot columns on job_applications
ALTER TABLE public.job_applications
  ADD COLUMN IF NOT EXISTS job_snapshot jsonb,
  ADD COLUMN IF NOT EXISTS snapshot_taken_at timestamptz;
