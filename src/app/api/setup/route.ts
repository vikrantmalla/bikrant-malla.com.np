import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { withPublicRateLimit } from '@/lib/api-utils';
import {
  createSuccessResponse,
  ConflictError,
} from '@/lib/api-errors';
import { validateRequest, registerSchema } from '@/lib/validation';
import { z } from 'zod';
import { Role } from '@/types/enum';
import { Resend } from 'resend';
import { resendConfig } from '@/lib/resend-config';

// Setup schema for system initialization
const setupSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100).optional(),
  portfolioName: z.string().min(1, "Portfolio name is required").max(100).trim(),
  jobTitle: z.string().min(1, "Job title is required").max(100).trim(),
});

// Check if system is already initialized
export const GET = withPublicRateLimit(async (request: NextRequest) => {
  const userCount = await prisma.user.count();
  const portfolioCount = await prisma.portfolio.count();
  
  const statusData = {
    isInitialized: userCount > 0 && portfolioCount > 0,
    userCount,
    portfolioCount
  };

  return createSuccessResponse(
    statusData,
    "System status retrieved successfully"
  );
});

// Create initial owner user
export const POST = withPublicRateLimit(async (request: NextRequest) => {
  // Check if system is already initialized
  const userCount = await prisma.user.count();
  const portfolioCount = await prisma.portfolio.count();
  
  if (userCount > 0 || portfolioCount > 0) {
    throw new ConflictError('System is already initialized');
  }

  const body = await request.json();
  const validation = validateRequest(setupSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { email, name, portfolioName, jobTitle, password } = validation.data;

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

  const responseData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    portfolio: {
      id: portfolio.id,
      name: portfolio.name
    }
  };

  return createSuccessResponse(
    responseData,
    'System initialized successfully! You can now log in with your credentials.',
    201
  );
});
