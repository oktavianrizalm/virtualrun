'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validasi input sisi server
  if (!email || !password) {
    redirect('/error?message=Email dan password wajib diisi')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    redirect('/error?message=Format email tidak valid')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    logger.log('security', 'Failed login attempt', { email, error: error.message })
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  logger.log('info', 'Successful login', { email })
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
