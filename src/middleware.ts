import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Extend NextRequest to include kindeAuth (optional for type safety)
interface KindeRequest extends NextRequest {
  kindeAuth?: {
    user?: {
      email?: string | null;
    } | null;
  };
}

export default withAuth(async function middleware(req: KindeRequest) {
  // Check if kindeAuth and user exist
  if (!req.kindeAuth || !req.kindeAuth.user || !req.kindeAuth.user.email) {
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      // Redirect to custom login page with the current path as redirect parameter
      const loginUrl = new URL('/login', req.nextUrl);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // For dashboard routes, we'll let the page handle role checking
  // This avoids Prisma edge runtime issues
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // The dashboard page will check roles via API calls
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*'],
};