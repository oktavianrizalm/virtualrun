'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string
  const captchaToken = formData.get('captchaToken') as string

  // Validasi: reCAPTCHA harus diisi
  if (!captchaToken) {
    redirect('/error?message=Mohon selesaikan verifikasi reCAPTCHA terlebih dahulu')
  }

  // Verifikasi reCAPTCHA manual ke Google (Server-to-Server)
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
  if (recaptchaSecret) {
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${recaptchaSecret}&response=${captchaToken}`
    })
    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      redirect('/error?message=Verifikasi reCAPTCHA gagal, bot terdeteksi.')
    }
  }

  // Validasi: pastikan password dan konfirmasi sama
  if (password !== confirmPassword) {
    redirect('/error?message=Passwords do not match')
  }

  const data = {
    email: formData.get('email') as string,
    password: password,
    phone: formData.get('phone') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string, // Metadata tambahan
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error.message)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
