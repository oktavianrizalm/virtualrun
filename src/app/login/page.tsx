import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] mt-20 w-full items-center justify-center bg-[#0e0e10] px-4 py-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00cbe6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[400px] bg-[#161618] rounded-2xl p-10 shadow-2xl relative z-10 border border-white/5">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-[#1c2127] rounded-xl flex items-center justify-center mb-6 border border-[#00cbe6]/20 shadow-[0_0_15px_rgba(0,203,230,0.1)]">
            {/* Lightning bolt icon */}
            <svg className="w-7 h-7 text-[#3adffa]" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <h1 className="text-[32px] font-black text-white font-headline tracking-wide mb-2">Virtual Run</h1>
          <p className="text-[#8c8f94] text-[10px] font-bold tracking-[0.2em]">CONNECT. COMPETE. CONQUER.</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5c5f66]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <input
                className="w-full bg-[#1c1c1e] border border-transparent rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-[#5c5f66] focus:outline-none focus:border-[#3adffa]/50 focus:ring-1 focus:ring-[#3adffa]/50 transition-all font-medium text-sm"
                id="email"
                name="email"
                placeholder="RUNNER@KINETIC.PULSE"
                type="email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-[10px] font-bold text-[#5c5f66] hover:text-[#3adffa] transition-colors uppercase tracking-widest">Forgot?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5c5f66]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input
                className="w-full bg-[#1c1c1e] border border-transparent rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-[#5c5f66] focus:outline-none focus:border-[#3adffa]/50 focus:ring-1 focus:ring-[#3adffa]/50 transition-all font-medium text-sm"
                id="password"
                name="password"
                placeholder="••••••••••••"
                type="password"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 pt-4">
            <button
              formAction={login}
              className="w-full bg-[#00cbe6] hover:bg-[#3adffa] text-[#00363e] font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,203,230,0.3)] hover:shadow-[0_0_30px_rgba(58,223,250,0.5)] active:scale-[0.98]"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="w-full bg-[#1c1c1e] text-white hover:bg-[#252528] font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-all text-center border border-transparent hover:border-white/5"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
