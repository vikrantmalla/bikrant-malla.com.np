import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user from cookie
    const authResult = await getUserFromCookie(request);
    
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        isActive: authResult.user.isActive,
        emailVerified: authResult.user.emailVerified,
      }
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
