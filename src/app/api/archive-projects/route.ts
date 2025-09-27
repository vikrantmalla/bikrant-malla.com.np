import { NextRequest } from "next/server";
import { checkEditorPermissions, checkPortfolioAccess } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import {
  withApiErrorHandler,
  withPublicRateLimit,
  withAdminRateLimit,
} from "@/lib/api-utils";
import {
  createSuccessResponse,
  NotFoundError,
  ConflictError,
  AuthorizationError,
} from "@/lib/api-errors";
import {
  createArchiveProjectSchema,
  validateRequest,
  objectIdSchema,
} from "@/lib/validation";

// GET all archive projects for user's portfolio
export const GET = withPublicRateLimit(async (request: NextRequest) => {
  const permissionCheck = await checkEditorPermissions(request);

  if (!permissionCheck.success) {
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      throw new Error("Permission check failed unexpectedly");
    }
  }

  const user = permissionCheck.user;

  if (!user || !user.email) {
    throw new NotFoundError("User not found");
  }

  // Check if user exists in our database
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { roles: true },
  });

  // If user doesn't exist, create them
  if (!dbUser) {
    const tempPassword = crypto.randomUUID();
    const hashedPassword = await hashPassword(tempPassword);

    dbUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name || user.email.split("@")[0],
        isActive: true,
        emailVerified: false,
      },
      include: { roles: true },
    });
  }

  // First, try to find a portfolio owned by this user
  let portfolio = await prisma.portfolio.findFirst({
    where: {
      ownerEmail: user.email,
    },
  });

  // If no portfolio found, try to find one where user has a role
  if (!portfolio) {
    const userRole = await prisma.userPortfolioRole.findFirst({
      where: {
        userId: dbUser.id,
      },
      include: { portfolio: true },
    });

    if (userRole) {
      portfolio = userRole.portfolio;
    }
  }

  if (!portfolio) {
    throw new NotFoundError("No portfolio found for user");
  }

  const archiveProjects = await prisma.archiveProject.findMany({
    where: { portfolioId: portfolio.id },
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
    {
      archiveProjects,
      portfolio: {
        id: portfolio.id,
        name: portfolio.name,
      },
    },
    "Archive projects retrieved successfully"
  );
});

// POST create new archive project
export const POST = withAdminRateLimit(async (request: NextRequest) => {
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
  const validation = validateRequest(createArchiveProjectSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { title, year, isNew, projectView, viewCode, build, portfolioId } =
    validation.data;

  // Check if user has access to the portfolio
  const { hasAccess } = await checkPortfolioAccess(
    permissionCheck.user.email,
    portfolioId
  );

  if (!hasAccess) {
    throw new AuthorizationError(
      "Access denied. You don't have permission to add archive projects to this portfolio."
    );
  }

  const newArchiveProject = await prisma.archiveProject.create({
    data: {
      title: title.trim(),
      year: year,
      isNew: isNew || false,
      projectView: projectView.trim(),
      viewCode: viewCode?.trim() || "",
      build: build || [],
      portfolioId: portfolioId,
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
    newArchiveProject,
    "Archive project created successfully",
    201
  );
});
