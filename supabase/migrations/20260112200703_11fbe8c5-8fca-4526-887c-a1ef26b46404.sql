-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create trigger for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create career_plans table (using role_title instead of current_role as it's reserved)
CREATE TABLE public.career_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  industry TEXT NOT NULL,
  years_experience TEXT NOT NULL,
  career_goal TEXT,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.career_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own career plans" 
ON public.career_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own career plans" 
ON public.career_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career plans" 
ON public.career_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own career plans" 
ON public.career_plans FOR DELETE 
USING (auth.uid() = user_id);

-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  email TEXT,
  linkedin TEXT,
  github TEXT,
  website TEXT,
  template TEXT DEFAULT 'modern',
  projects JSONB DEFAULT '[]'::jsonb,
  share_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portfolios" 
ON public.portfolios FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public portfolios" 
ON public.portfolios FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create their own portfolios" 
ON public.portfolios FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" 
ON public.portfolios FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" 
ON public.portfolios FOR DELETE 
USING (auth.uid() = user_id);

-- Create job_alerts table
CREATE TABLE public.job_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  location TEXT,
  industry TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  keywords TEXT[],
  is_active BOOLEAN DEFAULT true,
  email_frequency TEXT DEFAULT 'daily',
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own job alerts" 
ON public.job_alerts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job alerts" 
ON public.job_alerts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job alerts" 
ON public.job_alerts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job alerts" 
ON public.job_alerts FOR DELETE 
USING (auth.uid() = user_id);

-- Create user_progress table for tracking
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" 
ON public.user_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_plans_updated_at
BEFORE UPDATE ON public.career_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
BEFORE UPDATE ON public.portfolios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_alerts_updated_at
BEFORE UPDATE ON public.job_alerts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();