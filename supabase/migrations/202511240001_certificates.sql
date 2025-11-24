-- Migration: align certificates schema with local app expectations
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  certificate_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  recipient_name TEXT NOT NULL,
  name TEXT GENERATED ALWAYS AS (recipient_name) STORED,
  recipient_email TEXT,
  course_name TEXT NOT NULL,
  course TEXT GENERATED ALWAYS AS (course_name) STORED,
  issuer_name TEXT NOT NULL,
  signed_by TEXT GENERATED ALWAYS AS (issuer_name) STORED,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  signature TEXT NOT NULL,
  signature_url TEXT,
  public_key TEXT NOT NULL,
  fingerprint TEXT,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own certificates"
  ON public.certificates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own certificates"
  ON public.certificates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own certificates"
  ON public.certificates
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own certificates"
  ON public.certificates
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Anyone can verify certificates"
  ON public.certificates
  FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON public.certificates (certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON public.certificates (created_at DESC);

