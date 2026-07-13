import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

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
  '/api/private',
];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Rule 1: Unauthenticated user opening protected routes -> Redirect to /login
  if (!user && isProtectedRoute) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Rule 2: Authenticated user opening /login -> Automatically redirect to dashboard
  if (user && pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // Note: We intentionally DO NOT redirect from '/' if the user is authenticated,
  // as the landing page is always the default homepage.

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
