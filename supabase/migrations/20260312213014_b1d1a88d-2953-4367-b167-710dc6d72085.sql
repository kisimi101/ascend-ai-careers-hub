
CREATE TABLE public.search_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  search_date date NOT NULL DEFAULT CURRENT_DATE,
  search_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, search_date)
);

ALTER TABLE public.search_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search usage"
  ON public.search_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage search usage"
  ON public.search_usage FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
