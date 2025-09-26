import { NextRequest, NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withPublicRateLimit, withAdminRateLimit } from "@/lib/api-utils";
import { createSuccessResponse, NotFoundError, ConflictError } from "@/lib/api-errors";
import { createTechTagSchema, validateRequest, objectIdSchema } from "@/lib/validation";

// GET tech tag by ID
export const GET = withPublicRateLimit(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  
  // Validate ObjectId format
  const idValidation = objectIdSchema.safeParse(id);
  if (!idValidation.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Invalid ObjectId format",
        code: "VALIDATION_ERROR"
      }, 
      { status: 400 }
    );
  }

  const techTag = await prisma.techTag.findUnique({
    where: {
      id: id,
    },
    include: {
      projectRelations: {
        include: {
          project: true,
        },
      },
      archiveProjectRelations: {
        include: {
          archiveProject: true,
        },
      },
    },
  });

  if (!techTag) {
    throw new NotFoundError("Tech tag not found");
  }

  return createSuccessResponse(techTag, "Tech tag retrieved successfully");
});

// PUT update tech tag
export const PUT = withAdminRateLimit(async (
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

  const { id } = await params;
  
  // Validate ObjectId format
  const idValidation = objectIdSchema.safeParse(id);
  if (!idValidation.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Invalid ObjectId format",
        code: "VALIDATION_ERROR"
      }, 
      { status: 400 }
    );
  }

  const body = await request.json();
  const validation = validateRequest(createTechTagSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { tag } = validation.data;

  // Check if tag already exists with the new name (case-insensitive, excluding current tag)
  const existingTag = await prisma.techTag.findFirst({
    where: {
      AND: [
        {
          tag: {
            equals: tag,
            mode: "insensitive",
          },
        },
        {
          id: {
            not: id,
          },
        },
      ],
    },
  });

  if (existingTag) {
    throw new ConflictError("Tech tag with this name already exists");
  }

  // Update tech tag
  const updatedTechTag = await prisma.techTag.update({
    where: {
      id: id,
    },
    data: {
      tag: tag.trim(),
    },
  });

  return createSuccessResponse(updatedTechTag, "Tech tag updated successfully");
});

// DELETE tech tag
export const DELETE = withAdminRateLimit(async (
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

  const { id } = await params;
  
  // Validate ObjectId format
  const idValidation = objectIdSchema.safeParse(id);
  if (!idValidation.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Invalid ObjectId format",
        code: "VALIDATION_ERROR"
      }, 
      { status: 400 }
    );
  }

  // Check if tech tag is being used by any projects
  const projectUsage = await prisma.projectTag.findFirst({
    where: {
      tagId: id,
    },
  });

  const archiveProjectUsage = await prisma.archiveProjectTag.findFirst({
    where: {
      tagId: id,
    },
  });

  if (projectUsage || archiveProjectUsage) {
    throw new ConflictError(
      "Cannot delete tech tag. It is currently being used by projects or archive projects."
    );
  }

  // Delete tech tag
  await prisma.techTag.delete({
    where: {
      id: id,
    },
  });

  return createSuccessResponse(null, "Tech tag deleted successfully");
});
