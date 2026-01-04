-- Add parent-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create children table
CREATE TABLE public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female')),
  blood_type text,
  allergies text[],
  medical_notes text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on children
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- RLS policies for children - parents can only manage their own children
CREATE POLICY "Parents can view their own children"
ON public.children FOR SELECT
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create their own children"
ON public.children FOR INSERT
WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own children"
ON public.children FOR UPDATE
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own children"
ON public.children FOR DELETE
USING (auth.uid() = parent_id);

-- RLS policies for profiles (if not already set)
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Trigger to update updated_at on children
CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();