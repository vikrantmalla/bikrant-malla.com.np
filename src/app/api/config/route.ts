import { NextRequest } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import {
  withPublicRateLimit,
  withAdminRateLimit,
} from "@/lib/api-utils";
import {
  createSuccessResponse,
  NotFoundError,
  AuthorizationError,
} from "@/lib/api-errors";
import {
  updateConfigSchema,
  validateRequest,
} from "@/lib/validation";

// GET config
export const GET = withPublicRateLimit(async (request: NextRequest) => {
  let config = await prisma.config.findFirst();

  if (!config) {
    // Create default config if none exists
    config = await prisma.config.create({
      data: {
        maxWebProjects: 6,
        maxDesignProjects: 6,
        maxTotalProjects: 12,
      },
    });
  }

  return createSuccessResponse(config, "Config retrieved successfully");
});

// PUT config
export const PUT = withAdminRateLimit(async (request: NextRequest) => {
  const permissionCheck = await checkEditorPermissions(request);

  if (!permissionCheck.success) {
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      throw new Error("Permission check failed unexpectedly");
    }
  }

  if (!permissionCheck.user || !permissionCheck.user.email) {
    throw new AuthorizationError("User not found");
  }

  const body = await request.json();
  const validation = validateRequest(updateConfigSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { maxWebProjects, maxDesignProjects, maxTotalProjects } = validation.data;

  let config = await prisma.config.findFirst();

  if (!config) {
    config = await prisma.config.create({
      data: {
        maxWebProjects,
        maxDesignProjects,
        maxTotalProjects,
      },
    });
  } else {
    config = await prisma.config.update({
      where: { id: config.id },
      data: {
        maxWebProjects,
        maxDesignProjects,
        maxTotalProjects,
      },
    });
  }

  return createSuccessResponse(config, "Config updated successfully");
});
