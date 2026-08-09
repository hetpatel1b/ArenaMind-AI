import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/auth/error';
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/auth/error';
  return NextResponse.redirect(url);
}
