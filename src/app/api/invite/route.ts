import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import InvitationEmail from '@/components/emails/InvitationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Missing required fields: email, role' }, { status: 400 });
    }

    if (role !== 'editor' && role !== 'viewer') {
      return NextResponse.json({ error: 'Invalid role. Must be "editor" or "viewer"' }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { ownerEmail: user.email },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    if (portfolio.ownerEmail !== user.email) {
      return NextResponse.json({ error: 'Forbidden: Only the portfolio owner can invite users' }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let dbUser;
    if (existingUser) {
      dbUser = existingUser;
    } else {
      // Create a placeholder user record for the invited user
      dbUser = await prisma.user.create({
        data: {
          email,
          name: 'Invited User',
        },
      });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.userPortfolioRole.findFirst({
      where: {
        userId: dbUser.id,
        portfolioId: portfolio.id,
      },
    });

    if (existingInvitation) {
      // Update existing invitation
      await prisma.userPortfolioRole.update({
        where: { id: existingInvitation.id },
        data: { 
          role,
          invitedAt: new Date(),
        },
      });
    } else {
      // Create new invitation
      await prisma.userPortfolioRole.create({
        data: {
          userId: dbUser.id,
          portfolioId: portfolio.id,
          role,
          invitedAt: new Date(),
        },
      });
    }

    // Send email notification to the invited user using Resend
    const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DEFAULT_APP_URL}/login`;
    
    // Enhanced debug logging
    console.log('=== EMAIL DEBUG INFO ===');
    console.log('Environment variables:', {
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      resendFromEmail: process.env.RESEND_FROM_EMAIL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DEFAULT_APP_URL,
    });
    console.log('Email sending details:', {
      from: process.env.RESEND_FROM_EMAIL || 'noreply@bikrant-malla.com.np',
      to: email,
      signupUrl,
      portfolioName: portfolio.name,
      role,
    });
    console.log('========================');
    
    try {
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: `You have been invited to collaborate on ${portfolio.name}`,
        react: InvitationEmail({
          inviterName: user.given_name || user.email,
          portfolioName: portfolio.name,
          role,
          signupUrl,
        }),
      });
      
      console.log('✅ Email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('❌ Failed to send invitation email:', emailError);
      console.error('Email error details:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
      });
      
      // Check for specific domain verification error
      const errorMessage = emailError instanceof Error ? emailError.message : '';
      if (errorMessage.includes('domain is not verified')) {
        return NextResponse.json({ 
          error: 'Email domain not verified',
          details: 'The sending email domain is not verified in Resend. Please use a verified domain or contact support.',
          solution: 'Update RESEND_FROM_EMAIL to use a verified domain (e.g., onboarding@resend.dev for testing)',
          debug: {
            hasApiKey: !!process.env.RESEND_API_KEY,
            fromEmail: process.env.RESEND_FROM_EMAIL,
          }
        }, { status: 400 });
      }
      
      // Return error response with details for debugging
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: emailError instanceof Error ? emailError.message : 'Unknown error',
        debug: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          fromEmail: process.env.RESEND_FROM_EMAIL,
        }
      }, { status: 500 });
    }

    console.log(`Invitation created for ${email} with role ${role} to portfolio ${portfolio.name}`);

    return NextResponse.json({ 
      message: `Invitation sent to ${email} with role ${role}`,
      note: 'The user will need to sign up through the regular Kinde flow to access the portfolio'
    }, { status: 200 });

  } catch (error) {
    console.error('Invite user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}