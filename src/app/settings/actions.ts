'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logger } from '@/utils/logger'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const newPassword = formData.get('password') as string

  // Update Profile Name in `profiles` table
  if (fullName) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)

    if (profileError) {
      logger.log('error', 'Profile update failed', { error: profileError.message })
      redirect(`/error?message=Gagal memperbarui nama pengguna`)
    }
  }

  // Update Auth layer constraints (Email & Password)
  const updates: { email?: string, password?: string } = {}
  
  if (email && email !== user.email) {
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(email)) {
      updates.email = email
    } else {
      redirect('/error?message=Format email baru tidak valid')
    }
  }
  
  if (newPassword) {
    if (newPassword.length >= 8) {
      updates.password = newPassword
    } else {
      redirect('/error?message=Sandi baru terlalu pendek (minimal 8 karakter)')
    }
  }

  if (Object.keys(updates).length > 0) {
    const { error: authError } = await supabase.auth.updateUser(updates)
    if (authError) {
      logger.log('security', 'Settings security Auth update failed', { error: authError.message })
      redirect(`/error?message=${encodeURIComponent(authError.message)}`)
    }
  }

  logger.log('info', 'User updated account settings', { userId: user.id })

  revalidatePath('/dashboard')
  revalidatePath('/settings')
  redirect('/dashboard')
}
