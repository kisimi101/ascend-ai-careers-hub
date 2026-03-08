
-- Fix references table: change user_id from text to uuid and fix RLS policies

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can create references" ON public.references;
DROP POLICY IF EXISTS "Users can delete their own references" ON public.references;
DROP POLICY IF EXISTS "Users can update their own references" ON public.references;
DROP POLICY IF EXISTS "Users can view their own references" ON public.references;

-- Change user_id column type from text to uuid
ALTER TABLE public.references ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Recreate policies with proper auth checks
CREATE POLICY "Users can view their own references" ON public.references
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own references" ON public.references
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own references" ON public.references
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own references" ON public.references
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix shared_resumes: remove the overly permissive anon policy and replace with token-based
DROP POLICY IF EXISTS "Anyone can view active shared resumes by token" ON public.shared_resumes;

-- Allow public read only when accessed via the edge function (service role), not directly
-- The track-resume-view edge function already uses service role key
CREATE POLICY "Public can view active shared resumes" ON public.shared_resumes
  FOR SELECT TO anon USING (false);
