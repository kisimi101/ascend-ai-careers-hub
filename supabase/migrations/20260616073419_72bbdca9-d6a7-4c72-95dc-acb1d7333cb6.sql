
-- video_jobs table for async video-to-resume processing
CREATE TABLE public.video_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id TEXT NULL,
  storage_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  progress INT NOT NULL DEFAULT 0,
  result JSONB NULL,
  error TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.video_jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.video_jobs TO anon;
GRANT ALL ON public.video_jobs TO service_role;

ALTER TABLE public.video_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their video jobs"
  ON public.video_jobs FOR SELECT
  USING (
    (user_id IS NOT NULL AND auth.uid() = user_id)
    OR (user_id IS NULL AND guest_id IS NOT NULL)
  );

CREATE POLICY "Users insert their video jobs"
  ON public.video_jobs FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL AND guest_id IS NOT NULL)
  );

CREATE TRIGGER trg_video_jobs_updated
  BEFORE UPDATE ON public.video_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies on the `uploads` bucket
CREATE POLICY "Auth users manage own uploads"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anon can write guest prefix"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = 'guest');

CREATE POLICY "Anon can read guest prefix"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = 'guest');
