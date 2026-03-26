import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Virtual Run 2026',
  description: 'Join our virtual run and sync your Strava activities automatically.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased selection:bg-indigo-500/30`}>
        <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-2xl tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              VirtualRun
            </Link>
            <div className="flex gap-6 items-center text-sm font-medium text-zinc-300">
              <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
              <Link href="/dashboard" className="px-4 py-2 bg-white text-black font-semibold hover:bg-zinc-200 rounded-lg transition-colors shadow-lg">Dashboard</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
