CREATE TABLE public.guest_usage (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  action text not null,
  usage_date date not null default current_date,
  count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(fingerprint, action, usage_date)
);
GRANT ALL ON public.guest_usage TO service_role;
ALTER TABLE public.guest_usage ENABLE ROW LEVEL SECURITY;
-- No policies — table is service-role only (used by edge functions).
CREATE INDEX guest_usage_lookup_idx ON public.guest_usage (fingerprint, action, usage_date);