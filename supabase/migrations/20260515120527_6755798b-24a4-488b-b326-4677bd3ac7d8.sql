
-- 1) Keyword trend snapshots
CREATE TABLE IF NOT EXISTS public.keyword_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  keyword TEXT NOT NULL,
  volume INTEGER,
  difficulty NUMERIC,
  cpc NUMERIC,
  source TEXT NOT NULL DEFAULT 'manual',
  notes TEXT,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_keyword_trends_user_keyword_time
  ON public.keyword_trends (user_id, keyword, captured_at DESC);

ALTER TABLE public.keyword_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own keyword trends"
  ON public.keyword_trends FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert their own keyword trends"
  ON public.keyword_trends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own keyword trends"
  ON public.keyword_trends FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete their own keyword trends"
  ON public.keyword_trends FOR DELETE
  USING (auth.uid() = user_id);

-- 2) Fix: prevent public/anon harvesting of portfolio emails
-- RLS can't filter columns, so revoke column-level SELECT on `email` from anon and public.
REVOKE SELECT (email) ON public.portfolios FROM anon;
REVOKE SELECT (email) ON public.portfolios FROM public;
-- Owners (authenticated user matching user_id) can still read their own row via RLS + table-level grant.
