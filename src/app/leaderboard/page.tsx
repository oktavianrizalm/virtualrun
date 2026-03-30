import { createClient } from '@/utils/supabase/server'

export const revalidate = 60

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: activities, error } = await supabase
    .from('activities')
    .select('user_id, distance, moving_time, profiles(full_name)')
    .eq('approval_status', 'approved')

  if (error) {
    console.error(error)
  }

  const leaderboardMap = new Map<string, { name: string, distance: number, movingTime: number }>()

  if (activities) {
    for (const act of activities) {
      const uId = act.user_id
      const name = (act.profiles as any)?.full_name || 'Anonymous'
      const dist = act.distance || 0
      const time = act.moving_time || 0

      if (!leaderboardMap.has(uId)) {
        leaderboardMap.set(uId, { name, distance: 0, movingTime: 0 })
      }
      const entry = leaderboardMap.get(uId)!
      entry.distance += dist
      entry.movingTime += time
    }
  }

  // Pengurutan (Ranking) bersyarat
  const leaderboard = Array.from(leaderboardMap.values())
    .sort((a, b) => {
      // Prioritas 1: Jarak Terjauh (Descending)
      if (b.distance !== a.distance) {
        return b.distance - a.distance
      }
      // Prioritas 2 (Jika seri/jarak sama): Waktu Tercepat (Ascending)
      return a.movingTime - b.movingTime
    })

  // Format durasi dalam bentuk jam, menit, detik (misal: "1h 24m 10s")
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4 mt-8 mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent py-2">
          Event Leaderboard
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">See who has run the furthest and fastest. Stats update automatically via Strava.</p>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none"></div>

        {leaderboard.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <p className="text-zinc-500 text-xl font-medium">No runs recorded yet. Be the first to claim the top spot!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="border-b-2 border-zinc-800 bg-zinc-900/90">
                  <th className="py-5 px-8 text-zinc-400 font-semibold w-20 text-center uppercase tracking-wider text-sm">Rank</th>
                  <th className="py-5 px-8 text-zinc-400 font-semibold uppercase tracking-wider text-sm">Runner</th>
                  <th className="py-5 px-8 text-zinc-400 font-semibold uppercase tracking-wider text-sm">Total Time</th>
                  <th className="py-5 px-8 text-zinc-400 font-semibold text-right uppercase tracking-wider text-sm">Total Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {leaderboard.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/40 transition-colors group">
                    <td className="py-5 px-8 text-center text-xl">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span className="text-zinc-500 font-bold">{idx + 1}</span>}
                    </td>
                    <td className="py-5 px-8 font-bold text-white text-xl tracking-tight group-hover:text-emerald-400 transition-colors">{entry.name}</td>
                    <td className="py-5 px-8 text-zinc-400 font-medium text-lg">{formatTime(entry.movingTime)}</td>
                    <td className="py-5 px-8 font-extrabold text-right text-emerald-400 text-2xl tracking-tighter">
                      {(entry.distance / 1000).toFixed(2)} <span className="text-zinc-500 text-base font-medium uppercase tracking-widest ml-1">km</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
