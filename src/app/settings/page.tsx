import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-[calc(100vh-80px)] mt-20 w-full items-center justify-center bg-[#0e0e10] px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[500px] bg-[#161618] rounded-2xl p-10 shadow-2xl relative z-10 border border-white/5">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-black text-white font-headline tracking-wide mb-2">Account Settings</h1>
          <p className="text-[#8c8f94] text-sm font-medium">Perbarui informasi profil dan keamanan akun Anda.</p>
        </div>
        
        <form action={updateProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest" htmlFor="full_name">
              Nama Lengkap
            </label>
            <input
              defaultValue={profile?.full_name || ''}
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-4 py-3 text-white placeholder-[#5c5f66] focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium text-sm"
              id="full_name"
              name="full_name"
              type="text"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest" htmlFor="email">
              Alamat Email Baru
            </label>
            <input
              defaultValue={user.email}
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-4 py-3 text-white placeholder-[#5c5f66] focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium text-sm"
              id="email"
              name="email"
              type="email"
              required
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest" htmlFor="password">
              Password Baru (Opsional)
            </label>
            <input
              className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-4 py-3 text-white placeholder-[#5c5f66] focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium text-sm"
              id="password"
              name="password"
              placeholder="Kosongkan jika tidak ingin diubah"
              type="password"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-[#00363e] font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-[0.98]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
