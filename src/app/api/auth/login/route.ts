import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { generateAuthTokens, isValidEmail } from '@/lib/auth';
import { withAuthRateLimit, validateRequestMiddleware } from '@/lib/api-utils';
import { createSuccessResponse } from '@/lib/api-errors';

async function loginHandler(request: NextRequest) {
  // Validate request
  validateRequestMiddleware(request);

  const body = await request.json();
  const { email, password } = body;

  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error('Account is disabled. Please contact support.');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateAuthTokens({
    id: user.id,
    email: user.email,
    name: user.name,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
  });

  // Create response
  const response = createSuccessResponse(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
      accessToken, // Still return for client-side use
    },
    'Login successful'
  );

  // Set access token as HTTP-only cookie for server-side auth
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes (same as token expiry)
    path: '/',
  });

  // Set refresh token as HTTP-only cookie
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}

// Apply rate limiting and error handling
export const POST = withAuthRateLimit(loginHandler);
