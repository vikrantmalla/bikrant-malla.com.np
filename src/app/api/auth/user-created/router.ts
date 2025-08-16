import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user exists and update with kindeUserId if missing
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        kindeUserId: user.id, // Ensure kindeUserId is set
        name: user.given_name || user.family_name || 'User',
      },
      create: {
        email: user.email,
        kindeUserId: user.id,
        name: user.given_name || user.family_name || 'User',
      },
    });

    // Check if user has a portfolio role
    let userPortfolio = await prisma.userPortfolioRole.findFirst({
      where: { 
        user: { kindeUserId: user.id }
      },
      include: { portfolio: true }
    });

    // If no portfolio role exists, create one
    if (!userPortfolio) {
      // Find or create portfolio
      let portfolio = await prisma.portfolio.findFirst({
        where: { ownerEmail: user.email }
      });

      if (!portfolio) {
        portfolio = await prisma.portfolio.create({
          data: {
            name: 'My Portfolio',
            jobTitle: 'Developer',
            aboutDescription1: 'Welcome to my portfolio',
            skills: ['JavaScript', 'React', 'Next.js'],
            email: user.email,
            ownerEmail: user.email,
          },
        });
      }

      // Create user portfolio role
      userPortfolio = await prisma.userPortfolioRole.create({
        data: {
          userId: dbUser.id,
          portfolioId: portfolio.id,
          role: 'owner',
          invitedAt: new Date(),
        },
        include: { portfolio: true }
      });
    }

    return NextResponse.json({
      message: 'User authenticated successfully',
      user: dbUser,
      portfolio: userPortfolio?.portfolio
    });
  } catch (error) {
    console.error('Error in user-created route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
