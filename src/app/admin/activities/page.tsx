import { createClient } from '@/utils/supabase/server'
import { processManualUpload, deleteActivityAction } from '../actions'

export const revalidate = 0

export default async function AdminActivitiesPage() {
  const supabase = await createClient()

  // Tarik data seluruh bukti lari secara merangkap dari Supabase (termasuk milik semua orang)
  // Untuk menyunting riwayat user lain, kita harus login sebagai Admin/Moderator.
  // Karena RLS kita blok untuk orang asing, dalam halaman server kita panggil pakai admin client jika RLS menolak, TAPI di sini kita hanya *membaca*,
  // Mari kita cek RLS read pada schema kita: "Activities are viewable by everyone." (Select Using True). 
  // Jadi client standar Supabase sudah bisa menarik daftar *Activity* dari siapapun dengan aman.
  const { data: activities, error } = await supabase
    .from('activities')
    .select('id, name, distance, moving_time, type, approval_status, start_date, manual_proof_url, profiles(full_name)')
    .order('start_date', { ascending: false })

  if (error) {
    console.error(error)
  }

  const allActivities = activities || []

  return (
    <div className="space-y-12 pb-24 relative z-10 w-full max-w-6xl mx-auto">
      <header className="flex items-end justify-between border-b border-[#2a2d36] pb-6">
        <div>
          <h1 className="text-4xl font-black text-white font-headline tracking-wide">Review Uploads</h1>
          <p className="text-zinc-500 font-medium mt-2">Moderasi gambar tangkapan layar aktivitas peserta sebelum masuk ke Leaderboard.</p>
        </div>
      </header>

      <div className="bg-[#161618] border border-[#2a2d36] rounded-2xl overflow-hidden shadow-2xl">
        {allActivities.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            Belum ada satu pun riwayat lari yang terekam.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#1c1c1e] text-zinc-400 font-bold tracking-wider uppercase border-b border-[#2a2d36]">
                <tr>
                  <th className="py-4 px-6">Pelari</th>
                  <th className="py-4 px-6">Aktivitas</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6">Bukti Gambar</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2d36] text-zinc-300">
                {allActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6 font-bold text-white">{(act.profiles as any)?.full_name || 'Pelari Tanpa Nama'}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-cyan-400">{act.name}</div>
                      <div className="text-xs text-zinc-500">{(act.distance / 1000).toFixed(2)} KM • {Math.floor(act.moving_time / 60)} Mins</div>
                    </td>
                    <td className="py-4 px-6 text-zinc-400">{new Date(act.start_date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      {act.manual_proof_url ? (
                        <a href={act.manual_proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 font-medium uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-lg text-white transition-colors border border-zinc-700">
                          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          Cek Foto
                        </a>
                      ) : (
                        <span className="text-zinc-600 italic">Otomatis Strava</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                        act.approval_status === 'approved' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' :
                        act.approval_status === 'pending' ? 'bg-amber-950/50 text-amber-400 border border-amber-900/50' :
                        'bg-rose-950/50 text-rose-400 border border-rose-900/50'
                      }`}>
                        {act.approval_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                       {/* Tombol Tolak & Setujui KHUSUS UNTUK STATUS PENDING (Manual Upload) */}
                      {act.approval_status === 'pending' && act.manual_proof_url && (
                        <>
                          <form action={processManualUpload} className="inline-block">
                            <input type="hidden" name="activity_id" value={act.id} />
                            <input type="hidden" name="action" value="approve" />
                            <button type="submit" className="text-emerald-400 font-bold hover:text-white bg-emerald-950/30 hover:bg-emerald-600/50 px-3 py-1.5 rounded-lg border border-emerald-900/50 transition-colors text-xs uppercase tracking-widest">
                              Approve
                            </button>
                          </form>
                          <form action={processManualUpload} className="inline-block">
                            <input type="hidden" name="activity_id" value={act.id} />
                            <input type="hidden" name="action" value="reject" />
                            <button type="submit" className="text-amber-400 font-bold hover:text-white bg-amber-950/30 hover:bg-amber-600/50 px-3 py-1.5 rounded-lg border border-amber-900/50 transition-colors text-xs uppercase tracking-widest ml-2">
                              Reject
                            </button>
                          </form>
                        </>
                      )}
                      {/* Tombol Hapus Permanen Seluruh Kegiatan Ini (Termasuk dari Strava Auto) */}
                      <form action={deleteActivityAction} className="inline-block ml-4">
                        <input type="hidden" name="activity_id" value={act.id} />
                        <button type="submit" className="text-rose-500 font-bold hover:text-white bg-rose-950/30 hover:bg-rose-600/50 px-3 py-1.5 rounded-lg border border-rose-900/50 transition-colors text-xs uppercase tracking-widest">
                          Hapus Permanen
                        </button>
                      </form>
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
