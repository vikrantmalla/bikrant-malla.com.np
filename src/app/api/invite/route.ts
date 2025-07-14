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

    // Send invitation via Kinde API
    const response = await fetch(`${process.env.KINDE_ISSUER}/api/v1/users/invite`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KINDE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Kinde invite error:', errorData);
      return NextResponse.json({ error: `Failed to send invitation: ${errorData.message || 'Unknown error'}` }, { status: response.status });
    }

    const invitedUser = await response.json();
    console.log('Kinde invite response:', invitedUser); // Debug log

    // Create or update user in Prisma (in case webhook hasn't run yet)
    const dbUser = await prisma.user.upsert({
      where: { email },
      update: {
        name: invitedUser.first_name || 'Invited User',
      },
      create: {
        id: invitedUser.id || `kinde_${email}`,
        email,
        name: invitedUser.first_name || 'Invited User',
      },
    });

    // Assign role to the invited user
    const existingRole = await prisma.userPortfolioRole.findFirst({
      where: {
        userId: dbUser.id,
        portfolioId: portfolio.id,
      },
    });

    if (existingRole) {
      await prisma.userPortfolioRole.update({
        where: { id: existingRole.id },
        data: { role },
      });
    } else {
      await prisma.userPortfolioRole.create({
        data: {
          userId: dbUser.id,
          portfolioId: portfolio.id,
          role,
          invitedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ message: `Invitation sent to ${email} with role ${role}` }, { status: 200 });
  } catch (error) {
    console.error('Invite user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}