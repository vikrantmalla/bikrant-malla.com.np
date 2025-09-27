import { NextRequest, NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withPublicRateLimit, withAdminRateLimit } from "@/lib/api-utils";
import { createSuccessResponse, NotFoundError, ConflictError } from "@/lib/api-errors";
import { createTechOptionSchema, validateRequest, objectIdSchema } from "@/lib/validation";

// GET tech option by ID
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

  const techOption = await prisma.techOption.findUnique({
    where: {
      id: id,
    },
  });

  if (!techOption) {
    throw new NotFoundError("Tech option not found");
  }

  return createSuccessResponse(techOption, "Tech option retrieved successfully");
});

// PUT update tech option
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
  const validation = validateRequest(createTechOptionSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { name, category, description, isActive } = validation.data;

  // Check if tech option already exists in the same category (excluding current option)
  const existingOption = await prisma.techOption.findFirst({
    where: {
      AND: [
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        {
          category: {
            equals: category,
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

  if (existingOption) {
    throw new ConflictError("Tech option already exists in this category");
  }

  // Update tech option
  const updatedTechOption = await prisma.techOption.update({
    where: {
      id: id,
    },
    data: {
      name: name.trim(),
      category: category.trim(),
      description: description?.trim() || null,
      isActive: isActive,
    },
  });

  return createSuccessResponse(updatedTechOption, "Tech option updated successfully");
});

// DELETE tech option
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

  // Check if tech option is being used in any projects
  const projectsUsingTech = await prisma.project.findMany({
    where: {
      tools: {
        has: id,
      },
    },
  });

  if (projectsUsingTech.length > 0) {
    throw new ConflictError(
      `Cannot delete tech option. It is currently being used by ${projectsUsingTech.length} project(s).`
    );
  }

  // Delete tech option
  await prisma.techOption.delete({
    where: {
      id: id,
    },
  });

  return createSuccessResponse(null, "Tech option deleted successfully");
});
