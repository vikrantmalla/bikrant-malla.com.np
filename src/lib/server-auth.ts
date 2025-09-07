import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

export interface ServerAuthResult {
  isAuthenticated: boolean;
  user: any | null;
  error?: string;
}

/**
 * Check authentication on the server side using cookies
 */
export async function getServerAuth(): Promise<ServerAuthResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'No access token found'
      };
    }

    // Verify the token
    const decoded = verifyToken(accessToken);
    if (!decoded || !decoded.userId) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'Invalid token'
      };
    }

    // Get user data from database
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
      }
    };
  } catch (error) {
    console.error('Server auth error:', error);
    return {
      isAuthenticated: false,
      user: null,
      error: 'Authentication failed'
    };
  }
}

/**
 * Check if user has specific role
 */
export async function checkServerRole(requiredRole: 'OWNER' | 'EDITOR'): Promise<boolean> {
  try {
    const authResult = await getServerAuth();
    if (!authResult.isAuthenticated || !authResult.user) {
      return false;
    }

    // Check if user has the required role
    // This would need to be implemented based on your role checking logic
    return true; // Placeholder - implement based on your role system
  } catch (error) {
    console.error('Server role check error:', error);
    return false;
  }
}