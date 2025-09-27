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
  updateProjectSchema,
  validateRequest,
  objectIdSchema,
} from "@/lib/validation";

// GET project by ID
export const GET = withPublicRateLimit(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;

    // Validate ObjectId
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      throw new NotFoundError("Invalid project ID format");
    }

    const project = await prisma.project.findUnique({
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

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return createSuccessResponse(project, "Project retrieved successfully");
  }
);

// PUT update project
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
      throw new NotFoundError("Invalid project ID format");
    }

    const body = await request.json();
    const validation = validateRequest(updateProjectSchema, body);

    if (!validation.success) {
      throw validation.errors;
    }

    const { title, subTitle, images, alt, projectView, tools, platform } =
      validation.data;

    // Check if project exists and user has access
    const { isEditor, isOwner, hasAccess } = await checkProjectAccess(
      permissionCheck.user.email,
      id
    );

    if (!hasAccess) {
      throw new AuthorizationError("Access denied");
    }

    const updatedProject = await prisma.project.update({
      where: { id: id },
      data: {
        title: title.trim(),
        subTitle: subTitle?.trim() || "",
        images: images || "",
        alt: alt?.trim() || "",
        projectView: projectView.trim(),
        tools: tools || [],
        platform: platform,
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
      updatedProject,
      "Project updated successfully"
    );
  }
);

// DELETE project
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
      throw new NotFoundError("Invalid project ID format");
    }

    // Check if project exists and user has access
    const { isEditor, isOwner, hasAccess } = await checkProjectAccess(
      permissionCheck.user.email,
      id
    );

    if (!hasAccess) {
      throw new AuthorizationError("Access denied");
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.projectTag.deleteMany({
      where: { projectId: id },
    });

    await prisma.project.delete({
      where: { id: id },
    });

    return createSuccessResponse(null, "Project deleted successfully");
  }
);
