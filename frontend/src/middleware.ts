import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  const protectedRoutes = [
    '/appointments',
    '/edit-profile',
    '/schedule',
    '/search-appointments',
    '/register-specialty',
    '/register-doctor',
    '/register-patient'
  ]

  const isProtectedRoute = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/authentication', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/appointments/:path*',
    '/edit-profile/:path*',
    '/schedule/:path*',
    '/search-appointments/:path*',
    '/register-specialty/:path*',
    '/register-doctor/:path*',
    '/register-patient/:path*'
  ]
}
