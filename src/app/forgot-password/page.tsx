import { requestPasswordReset } from './actions'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] mt-20 w-full items-center justify-center bg-[#0e0e10] px-4 relative overflow-hidden">
      {/* Background decorations matching login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#68fcbf]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#131315]/80 backdrop-blur-xl rounded-3xl border border-[#2a2d36] p-8 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1c1f26] to-[#0e0e10] border border-[#2a2d36] shadow-inner mb-6">
            <svg className="w-8 h-8 text-[#68fcbf]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h1 className="text-3xl font-black font-headline text-white tracking-tight">Recover</h1>
          <p className="text-[#8e93a0] mt-2 font-medium">Lupa kata sandi? Masukkan email Anda.</p>
        </div>

        <form action={requestPasswordReset} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5c5f66]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="runner@virtual.com"
                  className="w-full bg-[#1c1c1e] border border-transparent rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#68fcbf] hover:bg-[#4be6a3] text-[#00363e] font-extrabold text-sm tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(104,252,191,0.2)] hover:shadow-[0_0_30px_rgba(104,252,191,0.4)] active:scale-[0.98]"
            >
              Kirim Link Reset
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-[#2a2d36] pt-6">
          <p className="text-[#8e93a0] font-medium text-sm">
            Ingat kata sandinya?{' '}
            <Link href="/login" className="text-white hover:text-[#3adffa] font-bold transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
