import { NextRequest, NextResponse } from 'next/server';
import { withApiErrorHandler } from '@/lib/api-utils';
import { createSuccessResponse } from '@/lib/api-errors';

async function logoutHandler(request: NextRequest) {
  // Create response
  const response = createSuccessResponse(
    { message: 'Logout successful' },
    'Logout successful'
  );

  // Clear access token cookie
  response.cookies.set('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  // Clear refresh token cookie
  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}

// Apply rate limiting and error handling
export const POST = withApiErrorHandler(logoutHandler, 'checkRole');
