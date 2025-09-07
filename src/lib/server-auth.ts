import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

export interface ServerAuthUser {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  emailVerified: boolean;
}

export async function getServerAuthUser(request: NextRequest): Promise<ServerAuthUser | null> {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return null;
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

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  } catch (error) {
    console.error('Server auth error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<ServerAuthUser> {
  const user = await getServerAuthUser(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
