import { NextRequest, NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withApiErrorHandler, withPublicRateLimit, withAdminRateLimit } from "@/lib/api-utils";
import { createSuccessResponse, ConflictError } from "@/lib/api-errors";
import { createTechOptionSchema, validateRequest } from "@/lib/validation";

// GET all tech options
export const GET = withPublicRateLimit(async (request: NextRequest) => {
  const techOptions = await prisma.techOption.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return createSuccessResponse(techOptions, "Tech options retrieved successfully");
});

// POST create new tech option
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
  const validation = validateRequest(createTechOptionSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { name, category, description, isActive } = validation.data;

  // Check if tech option already exists in the same category
  const existingOption = await prisma.techOption.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
  });

  if (existingOption) {
    throw new ConflictError("Tech option already exists in this category");
  }

  // Create new tech option
  const newTechOption = await prisma.techOption.create({
    data: {
      name: name.trim(),
      category: category.trim(),
      description: description?.trim() || null,
      isActive: isActive !== false, // Default to true
    },
  });

  return createSuccessResponse(newTechOption, "Tech option created successfully", 201);
});
