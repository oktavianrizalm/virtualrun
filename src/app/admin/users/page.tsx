import { createClient } from '@/utils/supabase/server'
import { updateUserRoleAction, forceResetPasswordAction } from '../actions'

export const revalidate = 0

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Tarik data seluruh pengguna profil. RLS kita izinkan membaca daftar pengguna.
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  const allUsers = users || []

  // Untuk mencari alamat email asli bawaan Supabase Auth Users kita memanggil admin.
  // Akan tetapi RLS standar membuat kita tak dapat mengakses tabel eksternal auth.users via query anonim klien.
  // Maka fungsi pengelolaan email harus langsung menduga email yang akan direset.
  // Untuk kesederhanaan, dalam MVP ini fungsi reset password akan bergantung pada input admin secara eksplisit.
  
  return (
    <div className="space-y-12 pb-24 relative z-10 w-full max-w-6xl mx-auto">
      <header className="flex items-end justify-between border-b border-[#2a2d36] pb-6">
        <div>
          <h1 className="text-4xl font-black text-white font-headline tracking-wide text-transparent bg-gradient-to-r from-fuchsia-400 to-rose-400 bg-clip-text">User Management</h1>
          <p className="text-zinc-500 font-medium mt-2">Ubah pangkat anggota atau jalankan tindakan reset kata sandi darurat.</p>
        </div>
      </header>

      <div className="bg-[#161618] border border-[#2a2d36] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#1c1c1e] text-zinc-400 font-bold tracking-wider uppercase border-b border-[#2a2d36]">
              <tr>
                <th className="py-4 px-6">Identitas Peserta</th>
                <th className="py-4 px-6">Gelar Akses (Role)</th>
                <th className="py-4 px-6">Waktu Bergabung</th>
                <th className="py-4 px-6 text-right">Menaikkan / Menurunkan Hak Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d36] text-zinc-300">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-lg">{u.full_name || 'Tanpa Nama'}</div>
                    <div className="text-xs text-zinc-500 font-mono mt-1 select-all">{u.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      u.role === 'admin' ? 'bg-fuchsia-950/50 text-fuchsia-400 border-fuchsia-900/50' :
                      u.role === 'moderator' ? 'bg-indigo-950/50 text-indigo-400 border-indigo-900/50' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      • {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-zinc-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-right">
                    <form action={updateUserRoleAction} className="inline-flex gap-2">
                       <input type="hidden" name="target_user_id" value={u.id} />
                       <select 
                         name="new_role" 
                         defaultValue={u.role}
                         className="bg-[#1c1c1e] text-xs font-bold uppercase tracking-widest text-zinc-300 border border-zinc-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400 transition-colors"
                       >
                         <option value="user">User Biasa</option>
                         <option value="moderator">Moderator</option>
                         <option value="admin">Super Admin</option>
                       </select>
                       <button type="submit" className="text-cyan-400 hover:text-white bg-cyan-950/30 hover:bg-cyan-600/50 px-3 py-1.5 rounded-lg border border-cyan-900/50 transition-colors text-xs font-bold uppercase tracking-widest">
                         Terapkan Pangkat Baru
                       </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zona Tindakan Darurat Eksternal Berbasis Email */}
      <h3 className="text-2xl font-black text-white font-headline tracking-wide text-transparent border-b border-[#2a2d36] pb-4 mt-16 pt-8">Zona Darurat Berbasis Email</h3>
      
      <div className="bg-[#1c1c1e] border border-rose-900/50 p-6 rounded-2xl max-w-2xl mt-8">
        <h4 className="text-rose-400 font-bold mb-2">Pemberian Perintah Tiket "Reset Password"</h4>
        <p className="text-sm text-zinc-400 mb-6">Paksa sistem Supabase untuk secara langsung mengirimkan tautan kadaluwarsa "Ganti Kata Sandi" ke alamat SUREL (E-mail) peserta jika mereka lupa sandi atau diretas.</p>
        
        <form action={forceResetPasswordAction} className="flex gap-4">
          <input 
            type="email" 
            name="email"
            placeholder="Ketik alamat email peserta asli..." 
            className="flex-1 bg-[#161618] border border-[#2a2d36] rounded-xl px-4 text-white text-sm focus:outline-none focus:border-rose-400 transition-colors"
            required
          />
          <button type="submit" className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:-translate-y-0.5 min-w-max">
            🔥 Kirim Tiket
          </button>
        </form>
      </div>

    </div>
  )
}
