import { type NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/server/auth/auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async (request) => {
  const session = request.auth;
  const isLoggedIn = !!session;
  const { pathname } = request.nextUrl;

  const isApiAuthRoute = pathname.startsWith('/api/auth');
  const isPublicRoute =
    pathname === '/login' || pathname === '/demo-register' || pathname === '/' || isApiAuthRoute;
  const isApiRoute = pathname.startsWith('/api') && !isApiAuthRoute;

  let response: NextResponse;

  // Fail-Safe Default: DENY unauthenticated requests
  if (!isLoggedIn && !isPublicRoute) {
    if (isApiRoute) {
      response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      response = NextResponse.redirect(loginUrl);
    }
  }
  // Rule 2: Authenticated user opening /login -> Automatically redirect to dashboard
  else if (isLoggedIn && pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    response = NextResponse.redirect(dashboardUrl);
  } else {
    // Proceed normally, but we need to inject headers if logged in
    if (isLoggedIn && session?.user) {
      const headers = new Headers(request.headers);
      headers.set('x-user-id', session.user.id || '');
      headers.set('x-user-role', session.user.role || '');
      if (session.user.organizationId) {
        headers.set('x-user-organization-id', session.user.organizationId);
      }

      response = NextResponse.next({
        request: {
          headers,
        },
      });
    } else {
      response = NextResponse.next();
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
  // Protect all routes by default, except internal Next.js paths and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
