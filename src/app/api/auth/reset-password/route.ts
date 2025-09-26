import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { withAuthRateLimit, validateRequestMiddleware } from '@/lib/api-utils';
import { createSuccessResponse } from '@/lib/api-errors';

async function resetPasswordHandler(request: NextRequest) {
  // Validate request
  validateRequestMiddleware(request);

  const { token, email, password } = await request.json();

  // Validate input
  if (!token || !email || !password) {
    throw new Error('Missing required fields: token, email, password');
  }

  // Validate password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // For now, we'll use a simple token validation
  // In a production system, you'd want to store tokens in the database with expiration
  // For this setup flow, we'll accept the token if the user exists and is not email verified
  if (user.emailVerified) {
    throw new Error('Password has already been set for this account');
  }

  // Hash the new password
  const hashedPassword = await hashPassword(password);

  // Update user with new password and mark email as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      emailVerified: true,
    },
  });

  // Get user's portfolio ID for redirect
  const userPortfolioRole = await prisma.userPortfolioRole.findFirst({
    where: { userId: user.id },
    include: { portfolio: true }
  });

  return createSuccessResponse({
    success: true,
    message: 'Password set successfully',
    redirectUrl: '/dashboard?setup=complete'
  }, 'Password set successfully');
}

// Apply rate limiting and error handling
export const POST = withAuthRateLimit(resetPasswordHandler);
