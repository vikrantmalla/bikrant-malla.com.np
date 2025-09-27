import { NextRequest } from "next/server";
import { checkEditorPermissions, checkProjectAccess } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withPublicRateLimit, withAdminRateLimit } from "@/lib/api-utils";
import {
  createSuccessResponse,
  NotFoundError,
  AuthorizationError,
} from "@/lib/api-errors";
import {
  updateArchiveProjectSchema,
  validateRequest,
  objectIdSchema,
} from "@/lib/validation";

// GET archive project by ID
export const GET = withPublicRateLimit(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;

    // Validate ObjectId
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      throw new NotFoundError("Invalid archive project ID format");
    }

    const archiveProject = await prisma.archiveProject.findUnique({
      where: { id: id },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!archiveProject) {
      throw new NotFoundError("Archive project not found");
    }

    return createSuccessResponse(
      archiveProject,
      "Archive project retrieved successfully"
    );
  }
);

// PUT update archive project
export const PUT = withAdminRateLimit(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
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

    const { id } = await params;

    // Validate ObjectId
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      throw new NotFoundError("Invalid archive project ID format");
    }

    const body = await request.json();
    const validation = validateRequest(updateArchiveProjectSchema, body);

    if (!validation.success) {
      throw validation.errors;
    }

    const { title, year, isNew, projectView, viewCode, build } =
      validation.data;

    // Check if archive project exists and user has access
    const { isEditor, isOwner, hasAccess } = await checkProjectAccess(
      permissionCheck.user.email,
      id
    );

    if (!hasAccess) {
      throw new AuthorizationError("Access denied");
    }

    const updatedArchiveProject = await prisma.archiveProject.update({
      where: { id: id },
      data: {
        title: title?.trim() || undefined,
        year: year || undefined,
        isNew: isNew !== undefined ? isNew : undefined,
        projectView: projectView?.trim() || undefined,
        viewCode: viewCode?.trim() || undefined,
        build: build || undefined,
      },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true,
          },
        },
      },
    });

    return createSuccessResponse(
      updatedArchiveProject,
      "Archive project updated successfully"
    );
  }
);

// DELETE archive project
export const DELETE = withAdminRateLimit(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
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

    const { id } = await params;

    // Validate ObjectId
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      throw new NotFoundError("Invalid archive project ID format");
    }

    // Check if archive project exists and user has access
    const { isEditor, isOwner, hasAccess } = await checkProjectAccess(
      permissionCheck.user.email,
      id
    );

    if (!hasAccess) {
      throw new AuthorizationError("Access denied");
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.archiveProjectTag.deleteMany({
      where: { archiveProjectId: id },
    });

    await prisma.archiveProject.delete({
      where: { id: id },
    });

    return createSuccessResponse(null, "Archive project deleted successfully");
  }
);
