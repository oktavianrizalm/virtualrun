import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Virtual Run</h1>
          <p className="text-zinc-400 text-sm">Sign in to sync your Strava activities and track your progress</p>
        </div>
        
        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="full_name">
              Full Name <span className="text-zinc-600 font-normal normal-case">(For new accounts)</span>
            </label>
            <input
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              id="full_name"
              name="full_name"
              placeholder="Jane Doe"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              required
            />
          </div>
          
          <div className="flex flex-col gap-3 pt-6">
            <button
              formAction={login}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="w-full bg-transparent border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 hover:text-white font-medium py-3 rounded-xl transition-all"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
