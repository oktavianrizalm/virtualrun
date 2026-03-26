import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const VERIFY_TOKEN = 'VIRTUAL_RUN_STRAVA_WEBHOOK'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      return NextResponse.json({ 'hub.challenge': challenge }, { status: 200 })
    }
  }
  return NextResponse.json({}, { status: 403 })
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log('Strava webhook event:', payload)

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (payload.object_type === 'activity' && payload.aspect_type === 'create') {
      const athleteId = payload.owner_id.toString()
      const activityId = payload.object_id.toString()

      // 1. Get user profile
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, strava_access_token, strava_refresh_token, strava_token_expires_at')
        .eq('strava_athlete_id', athleteId)
        .single()

      if (profile) {
        let accessToken = profile.strava_access_token

        // 2. Refresh token if expired
        const expiresAt = new Date(profile.strava_token_expires_at).getTime()
        if (Date.now() > expiresAt - 60000) { // 1 min buffer
          const refreshRes = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: process.env.STRAVA_CLIENT_ID,
              client_secret: process.env.STRAVA_CLIENT_SECRET,
              grant_type: 'refresh_token',
              refresh_token: profile.strava_refresh_token,
            }),
          })

          if (refreshRes.ok) {
            const newData = await refreshRes.json()
            accessToken = newData.access_token
            const newExpiresAt = new Date(newData.expires_at * 1000).toISOString()
            
            await supabaseAdmin
              .from('profiles')
              .update({
                strava_access_token: accessToken,
                strava_refresh_token: newData.refresh_token,
                strava_token_expires_at: newExpiresAt,
              })
              .eq('id', profile.id)
          }
        }

        // 3. Fetch activity details
        const activityRes = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (activityRes.ok) {
          const activityData = await activityRes.json()
          
          // 4. Insert into database using upsert
          await supabaseAdmin
            .from('activities')
            .upsert({
              user_id: profile.id,
              strava_activity_id: activityId,
              name: activityData.name,
              distance: activityData.distance,
              moving_time: activityData.moving_time,
              start_date: activityData.start_date,
              type: activityData.type,
            }, {
              onConflict: 'strava_activity_id'
            })
            
          console.log(`Successfully imported activity ${activityId} for user ${profile.id}`)
        }
      }
    }
    
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
