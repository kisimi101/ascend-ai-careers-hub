
CREATE TABLE public.shared_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  share_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  resume_data jsonb NOT NULL,
  template text NOT NULL DEFAULT 'modern-professional',
  title text DEFAULT 'My Resume',
  view_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own shared resumes" ON public.shared_resumes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own shared resumes" ON public.shared_resumes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own shared resumes" ON public.shared_resumes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shared resumes" ON public.shared_resumes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active shared resumes by token" ON public.shared_resumes FOR SELECT TO anon USING (is_active = true);
