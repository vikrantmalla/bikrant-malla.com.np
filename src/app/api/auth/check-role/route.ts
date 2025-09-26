import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, checkUserPermissions } from '@/lib/auth';
import { withApiErrorHandler } from '@/lib/api-utils';
import { createSuccessResponse, handleApiError } from '@/lib/api-errors';
import { validateRequestMiddleware } from '@/lib/api-utils';
import { rateLimiters } from '@/lib/rate-limit';

async function checkRoleHandler(request: NextRequest) {
  // Validate request
  validateRequestMiddleware(request);

  // Get user from token
  const authResult = await getUserFromToken(request);
  
  if (!authResult.user) {
    throw new Error(authResult.error || 'Unauthorized');
  }

  // Check user permissions
  const permissionCheck = await checkUserPermissions(authResult.user);

  if (!permissionCheck.user) {
    throw new Error('User not found');
  }

  return createSuccessResponse({
    user: {
      email: permissionCheck.user.email,
      name: permissionCheck.user.name,
      hasEditorRole: permissionCheck.hasEditorRole,
      isOwner: permissionCheck.isOwner,
      portfolio: permissionCheck.portfolio
    }
  }, 'User role checked successfully');
}

// Apply rate limiting and error handling
export const GET = withApiErrorHandler(checkRoleHandler, 'checkRole'); 