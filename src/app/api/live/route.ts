import { NextResponse } from 'next/server';

export async function GET() {
  // Liveness probe: Very lightweight, just checks if process is responding
  return new NextResponse('OK', { status: 200 });
}
