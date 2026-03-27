-- Create a new public bucket for run proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('run_proofs', 'run_proofs', true);

-- Tweak `activities` table to allow manual_proof_url link
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS manual_proof_url TEXT;

-- Allow public read access to the run proofs
CREATE POLICY "Public Read Access for run_proofs" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'run_proofs' );

-- Allow authenticated users to upload their own proofs
CREATE POLICY "Authenticated users can upload proofs" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'run_proofs' AND auth.role() = 'authenticated' );
