-- 1. Tambahkan kolom role ke tabel profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'::text;

-- (Opsional tapi Direkomendasikan) Ubah diri Anda sendiri menjadi Admin untuk pertama kalinya:
-- Gantilah email di bawah ini dengan email yang Anda gunakan saat mendaftar di website.
UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'email_anda@google.com');

-- 2. Tambahkan kolom approval_status ke tabel activities
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'approved'::text;
-- Status yang diperbolehkan: 'approved', 'pending', 'rejected'

-- 3. (Opsional) Jika Anda ingin menambahkan alasan penolakan untuk opsi B
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS rejection_reason text NULL;
