import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { prisma } from './prisma';
import { Role } from '@/types/enum';

export interface SecureAuthResult {
  isAuthenticated: boolean;
  user: any | null;
  error?: string;
}

/**
 * Secure authentication with full JWT signature verification
 * This should be used for all API routes that handle sensitive operations
 */
export async function getSecureAuth(request: NextRequest): Promise<SecureAuthResult> {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'No access token found'
      };
    }

    // Full JWT verification with signature validation
    const decoded = verifyToken(accessToken);
    if (!decoded || !decoded.userId) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'Invalid token'
      };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'User not found'
      };
    }

    if (!user.isActive) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'Account is disabled'
      };
    }

    return {
      isAuthenticated: true,
      user
    };
  } catch (error) {
    console.error('Secure auth error:', error);
    return {
      isAuthenticated: false,
      user: null,
      error: 'Authentication failed'
    };
  }
}

/**
 * Check if user has editor permissions with full security
 */
export async function checkSecureEditorPermissions(request: NextRequest) {
  try {
    const authResult = await getSecureAuth(request);
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return { 
        success: false, 
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        user: null
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: authResult.user.email },
      include: { 
        roles: {
          include: {
            portfolio: true
          }
        } 
      },
    });

    if (!dbUser) {
      return { 
        success: false, 
        response: NextResponse.json({ error: 'User not found' }, { status: 404 }),
        user: null
      };
    }

    // Check if user has editor role or is the portfolio owner
    const portfolio = await prisma.portfolio.findFirst({
      where: { ownerEmail: authResult.user.email },
    });
    const isOwner = !!portfolio;
    
    // Owner automatically gets editor role without invitation
    const hasEditorRole = dbUser.roles.some((role) => role.role === Role.EDITOR) || isOwner;

    if (!hasEditorRole) {
      return { 
        success: false, 
        response: NextResponse.json({ error: 'Insufficient permissions. Editor role required.' }, { status: 403 }),
        user: dbUser
      };
    }

    return { 
      success: true, 
      response: null,
      user: dbUser
    };
  } catch (error) {
    console.error('Error checking secure editor permissions:', error);
    return { 
      success: false, 
        response: NextResponse.json({ error: 'Internal server error' }, { status: 500 }),
      user: null
    };
  }
}
