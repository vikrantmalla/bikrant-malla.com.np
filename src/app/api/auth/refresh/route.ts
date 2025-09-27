import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken, generateToken } from '@/lib/jwt';
import { generateAuthTokens } from '@/lib/auth';
import { withApiErrorHandler } from '@/lib/api-utils';
import { createSuccessResponse } from '@/lib/api-errors';

async function refreshHandler(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    throw new Error('No refresh token provided');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.userId) {
    throw new Error('Invalid refresh token');
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isActive) {
    throw new Error('Account is disabled');
  }

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateAuthTokens({
    id: user.id,
    email: user.email,
    name: user.name,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
  });

  // Create response
  const response = createSuccessResponse(
    {
      message: 'Token refreshed successfully',
      accessToken,
    },
    'Token refreshed successfully'
  );

  // Set new refresh token as HTTP-only cookie
  response.cookies.set('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}

// Apply rate limiting and error handling
export const POST = withApiErrorHandler(refreshHandler, 'checkRole');
