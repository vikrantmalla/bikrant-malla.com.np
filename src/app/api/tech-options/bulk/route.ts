import { NextRequest, NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withAdminRateLimit } from "@/lib/api-utils";
import { createSuccessResponse, ConflictError } from "@/lib/api-errors";
import { bulkCreateTechOptionsSchema, bulkDeleteTechOptionsSchema, validateRequest } from "@/lib/validation";

// POST bulk create tech options
export const POST = withAdminRateLimit(async (request: NextRequest) => {
  const permissionCheck = await checkEditorPermissions(request);

  if (!permissionCheck.success) {
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      throw new Error("Permission check failed unexpectedly");
    }
  }

  const body = await request.json();
  const validation = validateRequest(bulkCreateTechOptionsSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { techOptions } = validation.data;
  const results = [];
  const errors = [];

  // Process each tech option
  for (const techOption of techOptions) {
    try {
      const trimmedName = techOption.name.trim();
      const trimmedCategory = techOption.category.trim();

      // Check if tech option already exists (case-insensitive)
      const existingOption = await prisma.techOption.findFirst({
        where: {
          name: {
            equals: trimmedName,
            mode: "insensitive",
          },
          category: {
            equals: trimmedCategory,
            mode: "insensitive",
          },
        },
      });

      if (existingOption) {
        errors.push({
          techOption: { name: trimmedName, category: trimmedCategory },
          error: "Tech option already exists in this category",
        });
      } else {
        // Create new tech option
        const newTechOption = await prisma.techOption.create({
          data: {
            name: trimmedName,
            category: trimmedCategory,
            description: techOption.description?.trim() || null,
            isActive: techOption.isActive !== false, // Default to true
          },
        });

        results.push(newTechOption);
      }
    } catch (error) {
      errors.push({
        techOption: { name: techOption.name, category: techOption.category },
        error: "Failed to create tech option",
      });
    }
  }

  const responseData = {
    created: results.length,
    failed: errors.length,
    results,
    errors,
  };

  return createSuccessResponse(
    responseData,
    "Bulk operation completed",
    errors.length === 0 ? 201 : 207 // 207 = Multi-Status
  );
});

// DELETE bulk delete tech options
export const DELETE = withAdminRateLimit(async (request: NextRequest) => {
  const permissionCheck = await checkEditorPermissions(request);

  if (!permissionCheck.success) {
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      throw new Error("Permission check failed unexpectedly");
    }
  }

  const body = await request.json();
  const validation = validateRequest(bulkDeleteTechOptionsSchema, body);

  if (!validation.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: validation.errors.errors || [validation.errors]
      }, 
      { status: 400 }
    );
  }

  const { techOptionIds } = validation.data;
  const results = [];
  const errors = [];

  // Process each tech option ID
  for (const techOptionId of techOptionIds) {
    try {
      // Check if tech option is being used in any projects
      const projectsUsingTech = await prisma.project.findMany({
        where: {
          tools: {
            has: techOptionId,
          },
        },
      });

      if (projectsUsingTech.length > 0) {
        errors.push({
          techOptionId: techOptionId,
          error: `Cannot delete tech option. It is currently being used by ${projectsUsingTech.length} project(s).`,
        });
      } else {
        // Delete tech option
        await prisma.techOption.delete({
          where: {
            id: techOptionId,
          },
        });

        results.push({ techOptionId, status: "deleted" });
      }
    } catch (error) {
      // Handle Prisma errors
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as any).code === "P2025"
      ) {
        errors.push({
          techOptionId: techOptionId,
          error: "Tech option not found",
        });
      } else {
        errors.push({
          techOptionId: techOptionId,
          error: "Failed to delete tech option",
        });
      }
    }
  }

  const responseData = {
    deleted: results.length,
    failed: errors.length,
    results,
    errors,
  };

  return createSuccessResponse(
    responseData,
    "Bulk deletion completed",
    errors.length === 0 ? 200 : 207 // 207 = Multi-Status
  );
});
