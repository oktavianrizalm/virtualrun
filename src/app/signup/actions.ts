'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string
  const phone = formData.get('phone') as string
  const full_name = formData.get('full_name') as string

  // Validasi Format Server
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    redirect('/error?message=Format email tidak valid')
  }

  if (password.length < 8) {
    redirect('/error?message=Kekuatan sandi lemah: Password minimal harus 8 karakter')
  }

  // Validasi: pastikan password dan konfirmasi sama
  if (password !== confirmPassword) {
    redirect('/error?message=Passwords do not match')
  }

  const payload = {
    email,
    password,
    phone,
    options: {
      data: {
        full_name,
        phone, // Metadata tambahan
      }
    }
  }

  const { data, error } = await supabase.auth.signUp(payload)

  if (error) {
    logger.log('security', 'Failed signup attempt', { email, error: error.message })
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  logger.log('info', 'New user registered via Signup boundary', { email })

  // Supabase Email Verification Safeguard
  if (data?.user && data?.session === null) {
      redirect('/error?message=Pendaftaran+Berhasil!+Silakan+periksa+email+Anda+(termasuk+Kotak+Masuk+atau+Spam)+untuk+mengonfirmasi+akun+sebelum+melakukan+login.')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
