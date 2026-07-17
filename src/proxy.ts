import { type NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/server/auth/auth.config';

const { auth } = NextAuth(authConfig);

// Define explicit route groups
const PROTECTED_ROUTES = [
  '/dashboard',
  '/incidents',
  '/crowd',
  '/resources',
  '/transport',
  '/reports',
  '/settings',
  '/profile',
  '/api/v1',
  '/api/private',
];

export default auth(async (request) => {
  const session = request.auth;
  const { pathname } = request.nextUrl;

  // NextAuth automatically handles session parsing, we just need to verify existence.
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Bypass nextauth API endpoints
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Rule 1: Unauthenticated user opening protected routes -> Redirect to /login
  if (!session && isProtectedRoute) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Rule 2: Authenticated user opening /login -> Automatically redirect to dashboard
  if (session && pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
