-- Create the update function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create references table for storing professional references
CREATE TABLE public.references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  relationship TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since using localStorage auth)
CREATE POLICY "Users can view their own references" 
ON public.references 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create references" 
ON public.references 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own references" 
ON public.references 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own references" 
ON public.references 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_references_updated_at
BEFORE UPDATE ON public.references
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();