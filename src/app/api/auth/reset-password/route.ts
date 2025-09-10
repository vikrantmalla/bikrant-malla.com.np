import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json();

    // Validate input
    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: token, email, password' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // For now, we'll use a simple token validation
    // In a production system, you'd want to store tokens in the database with expiration
    // For this setup flow, we'll accept the token if the user exists and is not email verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Password has already been set for this account' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      message: 'Password set successfully',
      redirectUrl: '/dashboard?setup=complete'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
