import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  // Let the client-side authentication handle the protection
  // This middleware just allows the request to pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};