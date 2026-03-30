import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Force HTTPS for production environments
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${request.headers.get('host')}${request.nextUrl.pathname}`, 301)
  }

  // 2. Traffic Logging for sensitive endpoint monitoring
  const path = request.nextUrl.pathname
  if (path.startsWith('/api/') || path.startsWith('/auth/') || path.startsWith('/login') || path.startsWith('/signup')) {
    const ip = request.headers.get('x-forwarded-for') || 'Unknown IP'
    console.log(JSON.stringify({
      level: 'info',
      type: 'traffic_log',
      path,
      ip,
      method: request.method,
      timestamp: new Date().toISOString()
    }))
  }

  return NextResponse.next()
}

// Ensure middleware only fires on active routes, ignoring static assets
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
