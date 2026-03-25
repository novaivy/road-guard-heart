-- Create enums for accident types
CREATE TYPE public.accident_severity AS ENUM ('minor', 'moderate', 'severe', 'fatal');
CREATE TYPE public.accident_type AS ENUM ('collision', 'rollover', 'pedestrian', 'cyclist', 'hit-and-run', 'multi-vehicle', 'single-vehicle', 'other');
CREATE TYPE public.report_status AS ENUM ('pending', 'verified', 'dispatched', 'resolved');

-- Create accidents table
CREATE TABLE public.accidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type public.accident_type NOT NULL,
  severity public.accident_severity NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  reporter_name TEXT,
  reporter_contact TEXT,
  status public.report_status NOT NULL DEFAULT 'pending',
  dispatch_notes TEXT,
  dispatched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.accidents ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public reporting)
CREATE POLICY "Anyone can submit accident reports"
  ON public.accidents FOR INSERT
  WITH CHECK (true);

-- Anyone can read (public data for map/dashboard)
CREATE POLICY "Anyone can view accident reports"
  ON public.accidents FOR SELECT
  USING (true);

-- Only authenticated users can update (admin dispatch)
CREATE POLICY "Authenticated users can update accidents"
  ON public.accidents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_accidents_updated_at
  BEFORE UPDATE ON public.accidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();