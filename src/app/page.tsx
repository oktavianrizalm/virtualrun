import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center space-y-12 relative overflow-hidden">
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 -z-10"></div>
      
      <div className="space-y-6 max-w-4xl pt-12">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter leading-tight">
          Run Anywhere.<br/>
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            Compete Everywhere.
          </span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Join the ultimate virtual running event. Connect your Strava account, track your progress automatically, and climb the global leaderboard.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 pt-4">
        <Link 
          href="/login"
          className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          Join the Event Now
        </Link>
        <Link
          href="/leaderboard"
          className="px-8 py-4 bg-zinc-900 border-2 border-zinc-800 text-white font-bold text-lg rounded-full hover:bg-zinc-800 transition-all hover:-translate-y-1"
        >
          View Leaderboard
        </Link>
      </div>
      
      <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl w-full">
        <div className="space-y-4 bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="text-4xl">🏃‍♂️</div>
          <h3 className="font-bold text-xl text-white">Run</h3>
          <p className="text-zinc-500 text-base leading-relaxed">Run anywhere, at your own pace. Record with the Strava app or your favorite GPS watch.</p>
        </div>
        <div className="space-y-4 bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="text-4xl">🔄</div>
          <h3 className="font-bold text-xl text-white">Sync</h3>
          <p className="text-zinc-500 text-base leading-relaxed">Connect your account once, and your activities sync automatically to our platform.</p>
        </div>
        <div className="space-y-4 bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="text-4xl">🏆</div>
          <h3 className="font-bold text-xl text-white">Compete</h3>
          <p className="text-zinc-500 text-base leading-relaxed">Check the leaderboard to see how you stack up against other runners globally.</p>
        </div>
      </div>
    </div>
  )
}
