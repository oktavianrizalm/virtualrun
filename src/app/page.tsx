import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative min-h-screen pt-20">
      {/* Atmospheric Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 grid-pattern"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] glow-aura blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-aura blur-[120px] opacity-60"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24 md:py-40 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low mb-8">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-label text-xs font-medium text-secondary uppercase tracking-[0.2em]">Live Global Event: Season 04</span>
        </div>
        <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl mb-10 text-glow">
          Run Anywhere. <br />
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Compete</span> Everywhere.
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed">
          Synchronize your metrics, challenge the global elite, and dominate the leaderboard from any trail, track, or treadmill on Earth.
        </p>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link href="/login" className="group relative px-10 py-5 bg-on-surface text-surface-container-lowest font-headline font-extrabold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]">
            Join the Event Now
          </Link>
          <Link href="/leaderboard" className="px-10 py-5 bg-surface-container-high/40 backdrop-blur-xl border border-outline-variant/30 text-primary font-headline font-bold text-lg rounded-xl hover:bg-surface-container-highest/60 transition-all duration-300">
            View Leaderboard
          </Link>
        </div>
      </section>

      {/* Bento-ish Feature Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-surface-container-low/50 backdrop-blur-md rounded-2xl border border-primary/20 hover:border-primary/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>directions_run</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Run</h3>
            <p className="text-on-surface-variant leading-relaxed">High-fidelity tracking across any GPS-enabled device. Every step counts toward your global ranking.</p>
          </div>
          <div className="p-8 bg-surface-container-low/50 backdrop-blur-md rounded-2xl border border-secondary/20 hover:border-secondary/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Sync</h3>
            <p className="text-on-surface-variant leading-relaxed">Real-time telemetry integration with Apple Watch, Garmin, and Strava. Seamless data, zero friction.</p>
          </div>
          <div className="p-8 bg-surface-container-low/50 backdrop-blur-md rounded-2xl border border-tertiary/20 hover:border-tertiary/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center mb-6 group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Compete</h3>
            <p className="text-on-surface-variant leading-relaxed">Join regional divisions or global open circuits. Win exclusive digital gear and physical pulse medals.</p>
          </div>
        </div>
      </section>

      {/* Visual Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>

      {/* Data Visual / Promo Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-32 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
            Track Your <br /> <span className="text-primary">Vapor Trace</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            Our proprietary analytics engine provides a 'Vapor Trace' of your performance, visualizing heart rate zones and pace surges as digital art.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-4xl font-black font-headline text-primary-dim">14.2M</div>
              <div className="text-label text-xs uppercase tracking-widest text-on-surface-variant mt-1">KM TRACKED</div>
            </div>
            <div>
              <div className="text-4xl font-black font-headline text-secondary">204k</div>
              <div className="text-label text-xs uppercase tracking-widest text-on-surface-variant mt-1">ATHLETES</div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="aspect-video rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/20 relative group">
            <img 
              alt="Athletic tracking interface" 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCtQpmGYuEmnWghrMNRgCLpsraoYG8orVYuo4LeBA_GhzUYO7UKrIhqDht1M-6z0C1qdApR21JuxAWTTeJKcz2vLGfAz0m2TaH48zkfzC5UPXZUeHx1H3KWftLpE0dvlTlK-Mg_-sHoW1-W45hirG0LiS7T4AP-ylh5Pupx-yx695tPd8M91aRk7EFS-2wXT_Ie7KX5j1XAOt-R4lUn1kwu1JYZpnlZ-HRo92EGdw45mmuZlescrkuybBVlAaAIa2K4Jx3NCd54U0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-surface-container-highest/80 backdrop-blur-xl rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-headline font-bold text-primary">LIVE TELEMETRY</span>
                <span className="text-xs text-tertiary">ZONE 4</span>
              </div>
              <div className="h-12 w-full bg-surface-container-low rounded flex items-end gap-1 px-2 pb-1 overflow-hidden">
                <div className="w-2 bg-primary/40 h-[20%] rounded-t-sm"></div>
                <div className="w-2 bg-primary/50 h-[40%] rounded-t-sm"></div>
                <div className="w-2 bg-primary/60 h-[35%] rounded-t-sm"></div>
                <div className="w-2 bg-primary/80 h-[70%] rounded-t-sm"></div>
                <div className="w-2 bg-primary h-[90%] rounded-t-sm"></div>
                <div className="w-2 bg-primary/90 h-[60%] rounded-t-sm"></div>
                <div className="w-2 bg-primary/70 h-[45%] rounded-t-sm"></div>
                <div className="w-2 bg-primary/50 h-[30%] rounded-t-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
