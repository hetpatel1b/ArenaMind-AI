import { handlers } from '@/server/auth/auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.includes('/error')) {
    const errorParam = searchParams.get('error') || 'Default';
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/error';
    redirectUrl.searchParams.set('error', errorParam);
    return NextResponse.redirect(redirectUrl);
  }
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.includes('/error')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/error';
    return NextResponse.redirect(redirectUrl);
  }
  return handlers.POST(request);
}
