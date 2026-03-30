'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function disconnectStrava() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from('profiles')
    .update({
      strava_athlete_id: null,
      strava_access_token: null,
      strava_refresh_token: null,
      strava_token_expires_at: null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Failed to disconnect Strava:', error.message)
  }

  // Reload the dashboard page natively via Next.js
  revalidatePath('/dashboard')
}
