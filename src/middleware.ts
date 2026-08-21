import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update the Supabase session (refreshes token if needed)
  const { supabaseResponse: response, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  // Define protected routes (simple prefix matching)
  const protectedPrefixes = ['/dashboard', '/profile', '/orders', '/admin']
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))

  // Define auth routes (users already logged in shouldn't see these)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isAuthRoute = authRoutes.includes(pathname)

  const hasSession = !!user

  if (isProtected && !hasSession) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    
    // Preserve cookies set by updateSession
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    }
    return redirectResponse
  }

  if (isAuthRoute && hasSession) {
    const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
    
    // Preserve cookies set by updateSession
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    }
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
