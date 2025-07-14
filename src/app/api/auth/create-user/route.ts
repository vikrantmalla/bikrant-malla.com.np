import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Create user in database
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.given_name || user.family_name || 'User',
      },
      create: {
        email: user.email,
        name: user.given_name || user.family_name || 'User',
      },
    });

    // Create a portfolio for this user (making them the owner)
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { ownerEmail: user.email },
    });

    let portfolio;
    if (existingPortfolio) {
      portfolio = existingPortfolio;
    } else {
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

    return NextResponse.json({
      message: 'User and portfolio created successfully',
      user: dbUser,
      portfolio: portfolio
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 