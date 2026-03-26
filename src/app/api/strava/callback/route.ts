import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/dashboard?error=strava_auth_failed', request.url))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET

  // Exchange code for tokens
  const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    console.error('Failed to exchange token with Strava')
    return NextResponse.redirect(new URL('/dashboard?error=strava_token_exchange_failed', request.url))
  }

  const tokenData = await tokenResponse.json()
  
  // Save to Supabase
  const expiresAt = new Date(tokenData.expires_at * 1000).toISOString()
  
  const { error: dbError } = await supabase
    .from('profiles')
    .update({
      strava_athlete_id: tokenData.athlete.id.toString(),
      strava_access_token: tokenData.access_token,
      strava_refresh_token: tokenData.refresh_token,
      strava_token_expires_at: expiresAt,
    })
    .eq('id', user.id)

  if (dbError) {
    console.error('Failed to update profile:', dbError)
    return NextResponse.redirect(new URL('/dashboard?error=profile_update_failed', request.url))
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
