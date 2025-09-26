import { NextRequest, NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withAdminRateLimit } from "@/lib/api-utils";
import { createSuccessResponse, ConflictError } from "@/lib/api-errors";
import { bulkCreateTechTagsSchema, bulkDeleteTechTagsSchema, validateRequest } from "@/lib/validation";

// POST bulk create tech tags
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
  const validation = validateRequest(bulkCreateTechTagsSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { tags } = validation.data;
  const results = [];
  const errors = [];

  // Process each tag
  for (const tag of tags) {
    try {
      const trimmedTag = tag.trim();

      // Check if tag already exists (case-insensitive)
      const existingTag = await prisma.techTag.findFirst({
        where: {
          tag: {
            equals: trimmedTag,
            mode: "insensitive",
          },
        },
      });

      if (existingTag) {
        errors.push({
          tag: trimmedTag,
          error: "Tag already exists",
        });
      } else {
        // Create new tech tag
        const newTechTag = await prisma.techTag.create({
          data: {
            tag: trimmedTag,
          },
        });

        results.push(newTechTag);
      }
    } catch (error) {
      errors.push({
        tag: tag,
        error: "Failed to create tag",
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

// DELETE bulk delete tech tags
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
  const validation = validateRequest(bulkDeleteTechTagsSchema, body);

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

  const { tagIds } = validation.data;
  const results = [];
  const errors = [];

  // Process each tag ID
  for (const tagId of tagIds) {
    try {
      // Check if tech tag is being used by any projects
      const projectUsage = await prisma.projectTag.findFirst({
        where: {
          tagId: tagId,
        },
      });

      const archiveProjectUsage = await prisma.archiveProjectTag.findFirst({
        where: {
          tagId: tagId,
        },
      });

      if (projectUsage || archiveProjectUsage) {
        errors.push({
          tagId: tagId,
          error:
            "Cannot delete tag. It is currently being used by projects or archive projects.",
        });
      } else {
        // Delete tech tag
        await prisma.techTag.delete({
          where: {
            id: tagId,
          },
        });

        results.push({ tagId, status: "deleted" });
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
          tagId: tagId,
          error: "Tag not found",
        });
      } else {
        errors.push({
          tagId: tagId,
          error: "Failed to delete tag",
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


