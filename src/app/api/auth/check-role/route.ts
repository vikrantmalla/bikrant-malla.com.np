import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Role } from '@/types/enum';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Test database connection first
    await prisma.$connect();
    
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { 
        roles: {
          include: {
            portfolio: true
          }
        } 
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has editor role or is the portfolio owner
    const portfolio = await prisma.portfolio.findFirst({
      where: { ownerEmail: user.email },
    });
    const isOwner = !!portfolio;
    
    // Owner automatically gets editor role without invitation
    const hasEditorRole = dbUser.roles.some((role) => role.role === Role.EDITOR) || isOwner;

    return NextResponse.json({
      user: {
        email: user.email,
        name: dbUser.name,
        hasEditorRole,
        isOwner,
        roles: dbUser.roles,
        portfolio: portfolio ? {
          id: portfolio.id,
          name: portfolio.name,
          ownerEmail: portfolio.ownerEmail
        } : null
      }
    });
  } catch (error) {
    console.error('Error checking user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 