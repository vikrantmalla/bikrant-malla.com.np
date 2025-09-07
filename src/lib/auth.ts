import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, generateToken } from '@/lib/jwt';
import { Role } from '@/types/enum';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  emailVerified: boolean;
}

export interface AuthResult {
  user: AuthUser | null;
  error?: string;
}

export interface PermissionCheck {
  user: AuthUser | null;
  hasEditorRole: boolean;
  isOwner: boolean;
  portfolio?: {
    id: string;
    name: string;
    ownerEmail: string;
  } | null;
}

/**
 * Get user from JWT token in request headers
 */
export async function getUserFromToken(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return { user: null, error: 'Invalid token' };
    }

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
      return { user: null, error: 'User not found' };
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };

    if (!authUser.isActive) {
      return { user: null, error: 'Account is disabled' };
    }

    return { user: authUser };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return { user: null, error: 'Token verification failed' };
  }
}

/**
 * Get user from session cookie
 */
export async function getUserFromSession(request: NextRequest): Promise<AuthResult> {
  try {
    const sessionToken = request.cookies.get('session')?.value;
    
    if (!sessionToken) {
      return { user: null, error: 'No session found' };
    }

    const decoded = verifyToken(sessionToken);

    if (!decoded || !decoded.userId) {
      return { user: null, error: 'Invalid session' };
    }

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
      return { user: null, error: 'User not found' };
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };

    if (!authUser.isActive) {
      return { user: null, error: 'Account is disabled' };
    }

    return { user: authUser };
  } catch (error) {
    console.error('Error getting user from session:', error);
    return { user: null, error: 'Session verification failed' };
  }
}

/**
 * Check user permissions and roles
 */
export async function checkUserPermissions(user: AuthUser): Promise<PermissionCheck> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
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
        user: null,
        hasEditorRole: false,
        isOwner: false,
        portfolio: null,
      };
    }

    // Check if user is portfolio owner
    const portfolio = await prisma.portfolio.findFirst({
      where: { ownerEmail: user.email },
    });
    
    const isOwner = !!portfolio;
    
    // Owner automatically gets editor role without invitation
    const hasEditorRole = dbUser.roles.some((role) => role.role === Role.EDITOR) || isOwner;

    return {
      user,
      hasEditorRole,
      isOwner,
      portfolio: portfolio ? {
        id: portfolio.id,
        name: portfolio.name,
        ownerEmail: portfolio.ownerEmail
      } : null,
    };
  } catch (error) {
    console.error('Error checking user permissions:', error);
    return {
      user: null,
      hasEditorRole: false,
      isOwner: false,
      portfolio: null,
    };
  }
}

/**
 * Generate authentication tokens
 */
export function generateAuthTokens(user: AuthUser) {
  const accessToken = generateToken(
    { userId: user.id, email: user.email },
    { expiresIn: '15m' }
  );
  
  const refreshToken = generateToken(
    { userId: user.id, email: user.email, type: 'refresh' },
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
