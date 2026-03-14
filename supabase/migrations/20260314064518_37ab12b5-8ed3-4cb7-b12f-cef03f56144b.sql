
CREATE TABLE public.interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  question text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  sample_answer text,
  tips jsonb DEFAULT '[]'::jsonb,
  upvotes integer DEFAULT 0,
  source text DEFAULT 'ai',
  created_at timestamptz DEFAULT now(),
  UNIQUE(company, role, question)
);

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read interview questions"
  ON public.interview_questions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can insert questions"
  ON public.interview_questions FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Authenticated users can upvote"
  ON public.interview_questions FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
