import { NextRequest, NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withApiErrorHandler, withPublicRateLimit, withAdminRateLimit } from "@/lib/api-utils";
import { createSuccessResponse, ConflictError, NotFoundError } from "@/lib/api-errors";
import { createTechTagSchema, validateRequest } from "@/lib/validation";

// GET all tech tags
export const GET = withPublicRateLimit(async (request: NextRequest) => {
  const techTags = await prisma.techTag.findMany({
    orderBy: {
      tag: "asc",
    },
  });

  return createSuccessResponse(techTags, "Tech tags retrieved successfully");
});

// POST create new tech tag
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
  const validation = validateRequest(createTechTagSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { tag } = validation.data;

  // Check if tag already exists (case-insensitive)
  const existingTag = await prisma.techTag.findFirst({
    where: {
      tag: {
        equals: tag,
        mode: "insensitive",
      },
    },
  });

  if (existingTag) {
    throw new ConflictError("Tech tag already exists");
  }

  // Create new tech tag
  const newTechTag = await prisma.techTag.create({
    data: {
      tag: tag.trim(),
    },
  });

  return createSuccessResponse(newTechTag, "Tech tag created successfully", 201);
});
