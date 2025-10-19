import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Skip auth check for public pages
  if (
    pathname === '/maintenance' ||
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Auth check for protected routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/account')) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
