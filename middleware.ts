import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './src/lib/session'

// Define protected and public routes
const protectedRoutes = ['/admin', '/admin/pets', '/admin/dashboard', '/account']
const publicRoutes = ['/auth/login', '/auth/register', '/auth/register-user', '/auth/unauthorized', '/', '/pets']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route)) || path.startsWith('/pets/')
  
  // Get session from cookie
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // Redirect to login if trying to access protected route without session
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
  }

  // Redirect to appropriate dashboard if authenticated user tries to access auth pages
  if (
    path.startsWith('/auth/') && 
    session?.userId &&
    !path.startsWith('/auth/unauthorized')
  ) {
    if (session.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    } else if (session.role === 'user') {
      return NextResponse.redirect(new URL('/account/dashboard', req.nextUrl))
    }
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  // Check admin role for admin routes
  if (path.startsWith('/admin') && session?.userId && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/unauthorized', req.nextUrl))
  }

  // Account routes are for authenticated users only (both admin and regular users can access)
  if (path.startsWith('/account') && !session?.userId) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
} 