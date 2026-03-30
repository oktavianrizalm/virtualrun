'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  // Server-side validation
  if (password.length < 8) {
    redirect('/error?message=Sandi terlalu pendek (minimal 8 karakter)')
  }

  if (password !== confirmPassword) {
    redirect('/error?message=Sandi konfirmasi tidak sesuai')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('Update password error:', error.message)
    redirect(`/error?message=Gagal memperbarui sandi: ${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard')
}
