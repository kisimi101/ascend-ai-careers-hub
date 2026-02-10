
-- Create favorite_companies table
CREATE TABLE public.favorite_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  company_website TEXT,
  company_linkedin TEXT,
  company_twitter TEXT,
  company_facebook TEXT,
  company_instagram TEXT,
  headquarters TEXT,
  employee_count TEXT,
  industry TEXT,
  founded TEXT,
  description TEXT,
  benefits TEXT[],
  culture TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_name)
);

-- Enable RLS
ALTER TABLE public.favorite_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON public.favorite_companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.favorite_companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own favorites" ON public.favorite_companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorite_companies FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_favorite_companies_updated_at
BEFORE UPDATE ON public.favorite_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
