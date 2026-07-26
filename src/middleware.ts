import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update the Supabase session (refreshes token if needed)
  const response = await updateSession(request)

  const { pathname } = request.nextUrl

  // Define protected routes (simple prefix matching)
  const protectedPrefixes = ['/dashboard', '/profile', '/orders', '/checkout', '/admin']
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))

  // Define auth routes (users already logged in shouldn't see these)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isAuthRoute = authRoutes.includes(pathname)

  // Retrieve user session cookie
  // Note: We use the server client inside updateSession. To just check if logged in without full fetch:
  // Since updateSession already fetches user to refresh, let's just use the cookies 
  // checking if they exist as a fast path, but actually `getUser` was called in updateSession.
  // Next.js middleware is edge, so we can't easily pass state from updateSession. 
  // We'll just check if the supabase auth token cookie exists.
  const authCookie = request.cookies.get('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0] + '-auth-token')
  const hasSession = !!authCookie

  if (isProtected && !hasSession) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
