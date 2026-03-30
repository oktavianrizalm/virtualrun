import { updatePassword } from './actions'

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] mt-20 w-full items-center justify-center bg-[#0e0e10] px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#68fcbf]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#131315]/80 backdrop-blur-xl rounded-3xl border border-[#2a2d36] p-8 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black font-headline text-white tracking-tight">Kunci Baru</h1>
          <p className="text-[#8e93a0] mt-2 font-medium">Buat sandi baru minimal 8 karakter.</p>
        </div>

        <form action={updatePassword} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="password">
                Password Baru
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-[#1c1c1e] border border-transparent rounded-xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#68fcbf] uppercase tracking-widest" htmlFor="confirm_password">
                Konfirmasi Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                className="w-full bg-[#1c1c1e] border border-transparent rounded-xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#68fcbf] hover:bg-[#4be6a3] text-[#00363e] font-extrabold text-sm tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(104,252,191,0.2)] hover:shadow-[0_0_30px_rgba(104,252,191,0.4)] active:scale-[0.98]"
            >
              Simpan & Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
