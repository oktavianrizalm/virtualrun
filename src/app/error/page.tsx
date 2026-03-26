'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="text-center text-white space-y-4">
      <h1 className="text-3xl font-bold text-red-400">Oops!</h1>
      <p className="text-zinc-400">{message || 'Sorry, something went wrong.'}</p>
      <Link href="/login" className="inline-block mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
        Return to Login
      </Link>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
