import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile to check Strava connection
  const { data: profile } = await supabase
    .from('profiles')
    .select('strava_athlete_id, full_name')
    .eq('id', user.id)
    .single()

  const isStravaConnected = !!profile?.strava_athlete_id

  // Fetch recent activities (regardless of Strava connection)
  const { data: activitiesData } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })
    .limit(5)
    
  const activities = activitiesData || []

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Virtual Run Dashboard</h1>
          <form action="/auth/signout" method="post">
             <button className="text-zinc-400 hover:text-white px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors text-sm font-medium shadow-lg">Sign Out</button>
          </form>
        </header>

        <section className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-6 text-white text-shadow-sm z-10 relative">Welcome back, {profile?.full_name || 'Runner'}</h2>
          
          {!isStravaConnected ? (
            <div className="space-y-6 z-10 relative bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50">
              <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl">You haven't connected your Strava account yet. Connect it to automatically sync your runs to the leaderboard!</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  href="/api/strava/auth"
                  className="inline-flex items-center justify-center gap-3 bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(252,76,2,0.3)] hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"></path></svg>
                  Connect with Strava
                </Link>
                <div className="flex items-center text-zinc-600 font-bold px-2 py-2">ATAU</div>
                <Link 
                  href="/dashboard/upload"
                  className="inline-flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:-translate-y-0.5 border border-zinc-700 hover:border-zinc-600 cursor-pointer"
                >
                  📸 Upload Manual Screenshot
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 z-10 relative">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-3 text-emerald-400 font-medium bg-emerald-400/10 px-5 py-3 rounded-xl border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Strava Connected Successfully
                </div>
                <Link 
                  href="/dashboard/upload"
                  className="inline-flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-xl transition-all border border-zinc-700 text-sm cursor-pointer"
                >
                  📸 Upload Manual Screenshot
                </Link>
              </div>
              <p className="text-zinc-400">Your activities will automatically appear here shortly after you finish a run.</p>
            </div>
          )}
        </section>

        <section className="space-y-6 mt-8">
          <h3 className="text-2xl font-bold">Recent Runs</h3>
            {activities.length === 0 ? (
              <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-12 text-center">
                <p className="text-zinc-500 italic text-lg">No runs synced yet. Time to hit the road! 🏃‍♂️</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex items-center justify-between transition-colors shadow-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-zinc-100">{activity.name}</h4>
                      <p className="text-zinc-400 text-sm">{new Date(activity.start_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{(activity.distance / 1000).toFixed(2)} km</p>
                      <p className="text-zinc-500 font-medium">{Math.floor(activity.moving_time / 60)} mins</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
      </div>
    </div>
  )
}
