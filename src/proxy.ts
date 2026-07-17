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
  let response = NextResponse.next();

  // NextAuth automatically handles session parsing, we just need to verify existence.
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!pathname.startsWith('/api/auth')) {
    // Rule 1: Unauthenticated user opening protected routes -> Redirect to /login
    if (!session && isProtectedRoute) {
      if (pathname.startsWith('/api')) {
        response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        response = NextResponse.redirect(loginUrl);
      }
    }
    // Rule 2: Authenticated user opening /login -> Automatically redirect to dashboard
    else if (session && pathname === '/login') {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      response = NextResponse.redirect(dashboardUrl);
    }
  }

  // Inject Enterprise Security Headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  response.headers.delete('x-powered-by');

  return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
