import { prisma } from './prisma';
import { NextResponse } from 'next/server';
import { Role } from '@/types/enum';
import { getUserFromCookie } from './auth';

export async function checkEditorPermissions(request: Request) {
  try {
    // Get user from custom authentication
    const authResult = await getUserFromCookie(request as any);
    
    if (!authResult.user) {
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
    console.error('Error checking editor permissions:', error);
    return { 
      success: false, 
      response: NextResponse.json({ error: 'Internal server error' }, { status: 500 }),
      user: null
    };
  }
}

// Helper function to check if user has editor role for a portfolio
export async function checkEditorRole(userEmail: string, portfolioId: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      roles: {
        where: {
          portfolioId: portfolioId,
          role: Role.EDITOR
        }
      }
    }
  });

  return user && user.roles.length > 0;
}

// Helper function to check if user is portfolio owner
export async function checkOwnerRole(userEmail: string, portfolioId: string) {
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id: portfolioId,
      ownerEmail: userEmail
    }
  });

  return !!portfolio;
}

// Helper function to check if user has editor role for a project's portfolio
export async function checkProjectEditorRole(userEmail: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      portfolio: {
        include: {
          userRoles: {
            where: {
              user: { email: userEmail },
              role: Role.EDITOR
            }
          }
        }
      }
    }
  });

  return project && project.portfolio && project.portfolio.userRoles.length > 0;
}

// Helper function to check if user is project's portfolio owner
export async function checkProjectOwnerRole(userEmail: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      portfolio: true
    }
  });

  return project && project.portfolio && project.portfolio.ownerEmail === userEmail;
}

// Helper function to check if user has editor role for an archive project's portfolio
export async function checkArchiveProjectEditorRole(userEmail: string, archiveProjectId: string) {
  const archiveProject = await prisma.archiveProject.findUnique({
    where: { id: archiveProjectId },
    include: {
      portfolio: {
        include: {
          userRoles: {
            where: {
              user: { email: userEmail },
              role: Role.EDITOR
            }
          }
        }
      }
    }
  });

  return archiveProject && archiveProject.portfolio && archiveProject.portfolio.userRoles.length > 0;
}

// Helper function to check if user is archive project's portfolio owner
export async function checkArchiveProjectOwnerRole(userEmail: string, archiveProjectId: string) {
  const archiveProject = await prisma.archiveProject.findUnique({
    where: { id: archiveProjectId },
    include: {
      portfolio: true
    }
  });

  return archiveProject && archiveProject.portfolio && archiveProject.portfolio.ownerEmail === userEmail;
}

// Generic function to check if user has any access (editor or owner) to a portfolio
export async function checkPortfolioAccess(userEmail: string, portfolioId: string) {
  const [isEditor, isOwner] = await Promise.all([
    checkEditorRole(userEmail, portfolioId),
    checkOwnerRole(userEmail, portfolioId)
  ]);

  return { isEditor, isOwner, hasAccess: isEditor || isOwner };
}

// Generic function to check if user has any access (editor or owner) to a project
export async function checkProjectAccess(userEmail: string, projectId: string) {
  const [isEditor, isOwner] = await Promise.all([
    checkProjectEditorRole(userEmail, projectId),
    checkProjectOwnerRole(userEmail, projectId)
  ]);

  return { isEditor, isOwner, hasAccess: isEditor || isOwner };
}

// Generic function to check if user has any access (editor or owner) to an archive project
export async function checkArchiveProjectAccess(userEmail: string, archiveProjectId: string) {
  const [isEditor, isOwner] = await Promise.all([
    checkArchiveProjectEditorRole(userEmail, archiveProjectId),
    checkArchiveProjectOwnerRole(userEmail, archiveProjectId)
  ]);

  return { isEditor, isOwner, hasAccess: isEditor || isOwner };
} 