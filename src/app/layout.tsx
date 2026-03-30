import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })

export const metadata: Metadata = {
  title: 'Virtual Run 2026',
  description: 'Join our virtual run and sync your Strava activities automatically.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let role = 'user'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) role = profile.role
  }

  return (
    <html lang="en" className="dark scroll-smooth w-full overflow-x-hidden">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${lexend.variable} font-body bg-surface text-on-surface antialiased selection:bg-primary selection:text-surface-container-lowest overflow-x-hidden`}>
        <nav className="fixed top-0 w-full z-50 bg-[#0e0e10]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
          <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
            <Link href="/" className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent font-headline tracking-tight">
              DiesNatITPLN
            </Link>
            <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
              <Link className="text-cyan-400 border-b-2 border-cyan-400 pb-1" href="/">Events</Link>
              <Link className="text-slate-400 hover:text-white transition-colors" href="/leaderboard">Leaderboard</Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white font-headline font-bold px-5 py-2 rounded-lg transition-all hover:bg-zinc-800">
                    Profile
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                    <Link href="/dashboard" className="block px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/settings" className="block px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors border-t border-zinc-800">
                      Settings
                    </Link>
                    {(role === 'admin' || role === 'moderator') && (
                      <Link href="/admin" className="block px-4 py-3 text-sm text-fuchsia-400 font-bold hover:bg-zinc-800 hover:text-fuchsia-300 transition-colors border-t border-zinc-800">
                        Admin Panel ({role})
                      </Link>
                    )}
                    <form action="/auth/signout" method="post" className="border-t border-zinc-800">
                      <button className="w-full text-left px-4 py-3 text-sm text-red-500 font-medium hover:bg-zinc-800 hover:text-red-400 transition-colors">
                        Log Out
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/login" className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-3xl hidden md:block">account_circle</Link>
                  <Link href="/login" className="bg-primary-container text-on-primary-container font-headline font-bold px-5 py-2 rounded-lg scale-95 duration-200 active:opacity-80 hover:scale-100 transition-all shadow-[0_0_15px_rgba(0,203,230,0.2)] hover:shadow-[0_0_25px_rgba(0,203,230,0.4)]">
                    Login / Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-[#0e0e10] w-full py-12 border-t border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-bold text-cyan-400 font-headline">DiesNatITPLN</div>
            <div className="flex flex-wrap justify-center gap-8 font-label text-sm tracking-wide">
              <Link className="text-slate-500 hover:text-slate-300 transition-colors" href="#">Terms of Service</Link>
              <Link className="text-slate-500 hover:text-slate-300 transition-colors" href="#">Privacy Policy</Link>
              <Link className="text-slate-500 hover:text-slate-300 transition-colors" href="#">Contact Support</Link>
              <Link className="text-slate-500 hover:text-slate-300 transition-colors" href="#">Sponsorships</Link>
            </div>
            <p className="text-slate-500 font-label text-sm">© 2026 Kinetic Pulse Virtual Run. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
