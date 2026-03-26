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

  // --- FITUR BARU: Tarik Data Lari 10 Hari Terakhir ---
  try {
    const tenDaysAgo = Math.floor(Date.now() / 1000) - (10 * 24 * 60 * 60)
    
    // Perintah fetch ke endpoint activities milik Strava
    const activitiesRes = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${tenDaysAgo}&per_page=30`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })

    if (activitiesRes.ok) {
      const historicalActivities = await activitiesRes.json()
      
      const allowedTypes = ['Run', 'TrailRun', 'VirtualRun', 'Walk', 'Hike']
      const runsToInsert = historicalActivities
        .filter((act: any) => allowedTypes.includes(act.type))
        .map((act: any) => ({
          user_id: user.id,
        strava_activity_id: act.id.toString(),
        name: act.name,
        distance: act.distance,
        moving_time: act.moving_time,
        start_date: act.start_date,
        type: act.type,
      }))

      if (runsToInsert.length > 0) {
        // Upsert mencegah munculnya data ganda (duplikat) jika user menghubungkan ulang
        const { error: insertError } = await supabase
          .from('activities')
          .upsert(runsToInsert, { onConflict: 'strava_activity_id' })
          
        if (insertError) {
          console.error('Gagal memasukkan data lari masa lalu:', insertError)
        } else {
          console.log(`Berhasil menarik dan menyimpan ${runsToInsert.length} aktivitas lari`)
        }
      }
    } else {
      console.error('Gagal mengambil history dari Strava:', await activitiesRes.text())
    }
  } catch (err) {
    console.error('Terjadi kesalahan sistem saat menarik data masa lalu:', err)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
