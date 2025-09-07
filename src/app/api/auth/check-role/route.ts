import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, checkUserPermissions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const authResult = await getUserFromToken(request);
    
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
    }

    // Check user permissions
    const permissionCheck = await checkUserPermissions(authResult.user);

    if (!permissionCheck.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        email: permissionCheck.user.email,
        name: permissionCheck.user.name,
        hasEditorRole: permissionCheck.hasEditorRole,
        isOwner: permissionCheck.isOwner,
        portfolio: permissionCheck.portfolio
      }
    });
  } catch (error) {
    console.error('Error checking user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 