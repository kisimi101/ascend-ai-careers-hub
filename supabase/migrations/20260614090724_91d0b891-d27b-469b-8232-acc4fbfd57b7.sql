
-- 1) guest_usage: server-side only
REVOKE ALL ON public.guest_usage FROM anon, authenticated;
GRANT ALL ON public.guest_usage TO service_role;

-- 2) interview_questions: restrict updates to the upvotes column via trigger
DROP POLICY IF EXISTS "Authenticated users can upvote" ON public.interview_questions;

CREATE OR REPLACE FUNCTION public.prevent_interview_question_field_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.question      IS DISTINCT FROM OLD.question
     OR NEW.company    IS DISTINCT FROM OLD.company
     OR NEW.role       IS DISTINCT FROM OLD.role
     OR NEW.category   IS DISTINCT FROM OLD.category
     OR NEW.difficulty IS DISTINCT FROM OLD.difficulty
     OR NEW.sample_answer IS DISTINCT FROM OLD.sample_answer
     OR NEW.tips       IS DISTINCT FROM OLD.tips
     OR NEW.source     IS DISTINCT FROM OLD.source
     OR NEW.id         IS DISTINCT FROM OLD.id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'Only the upvotes column may be modified';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_interview_questions_only_upvotes ON public.interview_questions;
CREATE TRIGGER trg_interview_questions_only_upvotes
BEFORE UPDATE ON public.interview_questions
FOR EACH ROW
WHEN (pg_has_role(current_user, 'service_role', 'MEMBER') = false)
EXECUTE FUNCTION public.prevent_interview_question_field_changes();

CREATE POLICY "Authenticated users can upvote"
ON public.interview_questions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 3) portfolios: stop exposing email to public viewers
DROP POLICY IF EXISTS "Anyone can view public portfolios" ON public.portfolios;

CREATE OR REPLACE VIEW public.public_portfolios
WITH (security_invoker = true) AS
SELECT id, user_id, name, title, bio, linkedin, github, website,
       template, projects, share_url, created_at, updated_at
FROM public.portfolios
WHERE is_public = true;

GRANT SELECT ON public.public_portfolios TO anon, authenticated;

-- 4) shared_resumes: enable working anon share links
DROP POLICY IF EXISTS "Public can view active shared resumes" ON public.shared_resumes;
CREATE POLICY "Public can view active shared resumes"
ON public.shared_resumes
FOR SELECT
TO anon
USING (is_active = true);

-- 5) Revoke execute on SECURITY DEFINER trigger function from public roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
