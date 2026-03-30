import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Hanya Admin & Moderator yang boleh mengakses panel /admin
  if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
    redirect('/dashboard')
  }

  const isAdmin = profile.role === 'admin'

  return (
    <div className="flex h-screen pt-[72px] bg-[#0e0e10]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#161618] border-r border-[#2a2d36] h-full flex flex-col fixed z-20 overflow-y-auto">
        <div className="p-6">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Control Panel</p>
          <h2 className="text-xl font-black text-white font-headline tracking-wide uppercase">
            {profile.role}
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin/activities" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all group font-medium text-sm">
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Review Uploads
          </Link>

          {/* User Management Menu HANYA KHUSUS UNTUK ADMIN */}
          {isAdmin && (
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all group font-medium text-sm">
              <svg className="w-5 h-5 text-zinc-500 group-hover:text-fuchsia-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              User Management
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto bg-surface relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -mt-32 -mr-32"></div>
        {children}
      </main>
    </div>
  )
}
