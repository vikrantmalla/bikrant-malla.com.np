import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { generateAuthTokens, isValidEmail, isValidPassword } from '@/lib/auth';
import { withAuthRateLimit, validateRequestMiddleware } from '@/lib/api-utils';
import { createSuccessResponse } from '@/lib/api-errors';

async function registerHandler(request: NextRequest) {
  // Validate request
  validateRequestMiddleware(request);

  const body = await request.json();
  const { email, password, name } = body;

  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || null,
      isActive: true,
      emailVerified: false, // TODO: Implement email verification
    },
  });

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
      accessToken,
    },
    'Registration successful'
  );

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
export const POST = withAuthRateLimit(registerHandler);
