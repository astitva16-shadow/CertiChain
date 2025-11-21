-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    organization TEXT
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own data
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    certificate_id TEXT NOT NULL UNIQUE,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    course_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    certificate_data JSONB NOT NULL,
    qr_code TEXT,
    is_verified BOOLEAN DEFAULT false,
    metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own certificates
CREATE POLICY "Users can view their own certificates" ON public.certificates
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own certificates
CREATE POLICY "Users can create their own certificates" ON public.certificates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own certificates
CREATE POLICY "Users can update their own certificates" ON public.certificates
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own certificates
CREATE POLICY "Users can delete their own certificates" ON public.certificates
    FOR DELETE USING (auth.uid() = user_id);

-- Create policy for public certificate verification (anyone can read by certificate_id)
CREATE POLICY "Anyone can verify certificates" ON public.certificates
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON public.certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON public.certificates(created_at DESC);

-- Create a function to automatically create a user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
