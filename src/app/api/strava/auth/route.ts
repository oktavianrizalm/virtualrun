import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const clientId = process.env.STRAVA_CLIENT_ID
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin
  const redirectUri = `${baseUrl}/api/strava/callback`

  const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize')
  stravaAuthUrl.searchParams.append('client_id', clientId!)
  stravaAuthUrl.searchParams.append('response_type', 'code')
  stravaAuthUrl.searchParams.append('redirect_uri', redirectUri)
  stravaAuthUrl.searchParams.append('approval_prompt', 'force')
  stravaAuthUrl.searchParams.append('scope', 'activity:read_all')

  return NextResponse.redirect(stravaAuthUrl.toString())
}
