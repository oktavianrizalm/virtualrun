'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    redirect('/error?message=Email wajib diisi')
  }

  const supabase = await createClient()

  // Supabase takes care of creating the reset link and emailing the user
  const origin = process.env.NEXT_PUBLIC_SITE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    console.error('Reset error:', error.message)
    redirect(`/error?message=Gagal mengirim link token: ${encodeURIComponent(error.message)}`)
  }

  redirect('/error?message=Sukses!+Silakan+periksa+email+Anda+untuk+tautan+reset+kata+sandi.')
}
