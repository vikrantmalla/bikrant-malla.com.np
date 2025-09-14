import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { generateAuthTokens } from '@/lib/auth';
import { Role } from '@/types/enum';
import { Resend } from 'resend';
import { resendConfig } from '@/lib/resend-config';

// Check if system is already initialized
export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const portfolioCount = await prisma.portfolio.count();
    
    return NextResponse.json({
      isInitialized: userCount > 0 && portfolioCount > 0,
      userCount,
      portfolioCount
    });
  } catch (error) {
    console.error('Error checking system status:', error);
    return NextResponse.json(
      { error: 'Failed to check system status' },
      { status: 500 }
    );
  }
}

// Create initial owner user
export async function POST(request: NextRequest) {
  try {
    // Check if system is already initialized
    const userCount = await prisma.user.count();
    const portfolioCount = await prisma.portfolio.count();
    
    if (userCount > 0 || portfolioCount > 0) {
      return NextResponse.json(
        { error: 'System is already initialized' },
        { status: 400 }
      );
    }

    const { email, name, portfolioName, jobTitle, password } = await request.json();

    // Validate required fields
    if (!email || !name || !portfolioName || !jobTitle || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, portfolioName, jobTitle, password' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    // Hash the provided password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        isActive: true,
        emailVerified: true, // User is verified since they set their own password
      }
    });

    // Create portfolio with minimal data - user will complete it later
    const portfolio = await prisma.portfolio.create({
      data: {
        name: portfolioName,
        jobTitle,
        aboutDescription1: "", // User will fill this in the portfolio form
        aboutDescription2: "", // User will fill this in the portfolio form
        skills: [], // User will select their skills in the portfolio form
        ownerEmail: email.toLowerCase(),
        linkedIn: "",
        gitHub: "",
        behance: "",
        twitter: "",
      }
    });

    // Create user portfolio role (OWNER)
    await prisma.userPortfolioRole.create({
      data: {
        userId: user.id,
        portfolioId: portfolio.id,
        role: Role.OWNER,
      }
    });

    // Send welcome email (optional)
    if (resendConfig.apiKey) {
      try {
        const resend = new Resend(resendConfig.apiKey);
        
        await resend.emails.send({
          from: resendConfig.fromEmail,
          to: email,
          subject: `Welcome to ${portfolioName}!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Welcome to ${portfolioName}!</h2>
              <p>Your portfolio system has been successfully set up and is ready to use.</p>
              
              <p>You can now log in to your dashboard and start building your portfolio.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resendConfig.appUrl}/login" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              
              <p>If you didn't request this setup, please ignore this email.</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                This is an automated message from your portfolio system.
              </p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the setup if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'System initialized successfully! You can now log in with your credentials.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      portfolio: {
        id: portfolio.id,
        name: portfolio.name
      }
    });

  } catch (error) {
    console.error('Error during system setup:', error);
    return NextResponse.json(
      { error: 'Failed to initialize system' },
      { status: 500 }
    );
  }
}
