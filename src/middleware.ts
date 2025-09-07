import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  // Check if the request is for dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // Get the access token from cookies
    const accessToken = req.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      // No token provided, redirect to login
      const loginUrl = new URL('/login', req.nextUrl);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Basic token structure validation (Edge Runtime compatible)
    try {
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        const loginUrl = new URL('/login', req.nextUrl);
        loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Decode and check expiration
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.userId || !payload.email) {
        const loginUrl = new URL('/login', req.nextUrl);
        loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        const loginUrl = new URL('/login', req.nextUrl);
        loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Token structure is valid, let server-side auth handle full verification
      return NextResponse.next();
    } catch (error) {
      // Token verification failed, redirect to login
      const loginUrl = new URL('/login', req.nextUrl);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};