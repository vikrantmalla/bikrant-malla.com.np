import { NextRequest, NextResponse } from "next/server";
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
  createProjectSchema,
  validateRequest,
  objectIdSchema,
} from "@/lib/validation";
import { Platform } from "@/types/enum";

// GET all projects for user's portfolio
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

  const projects = await prisma.project.findMany({
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
      projects,
      portfolio: {
        id: portfolio.id,
        name: portfolio.name,
      },
    },
    "Projects retrieved successfully"
  );
});

// POST create new project
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
  const validation = validateRequest(createProjectSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const {
    title,
    subTitle,
    images,
    alt,
    projectView,
    tools,
    platform,
    portfolioId,
  } = validation.data;

  // Check if user has access to the portfolio
  const { hasAccess } = await checkPortfolioAccess(
    permissionCheck.user.email,
    portfolioId
  );

  if (!hasAccess) {
    throw new AuthorizationError(
      "Access denied. You don't have permission to add projects to this portfolio."
    );
  }

  // Get config for project limits
  let config = await prisma.config.findFirst();
  if (!config) {
    config = await prisma.config.create({
      data: {
        maxWebProjects: 6,
        maxDesignProjects: 6,
        maxTotalProjects: 12,
      },
    });
  }

  // Count existing projects for this portfolio
  const existingProjects = await prisma.project.findMany({
    where: { portfolioId: portfolioId },
  });

  const totalProjects = existingProjects.length;
  const webProjects = existingProjects.filter(
    (p) => p.platform === Platform.Web
  ).length;
  const designProjects = existingProjects.filter(
    (p) => p.platform === Platform.Design
  ).length;

  // Validate project limits
  if (totalProjects >= config.maxTotalProjects) {
    throw new ConflictError(
      `Maximum total projects limit reached (${config.maxTotalProjects}). Cannot create more projects.`
    );
  }

  if (platform === Platform.Web && webProjects >= config.maxWebProjects) {
    throw new ConflictError(
      `Maximum Web projects limit reached (${config.maxWebProjects}). Cannot create more Web projects.`
    );
  }

  if (
    platform === Platform.Design &&
    designProjects >= config.maxDesignProjects
  ) {
    throw new ConflictError(
      `Maximum Design projects limit reached (${config.maxDesignProjects}). Cannot create more Design projects.`
    );
  }

  const newProject = await prisma.project.create({
    data: {
      title: title.trim(),
      subTitle: subTitle?.trim() || "",
      images: images || "",
      alt: alt?.trim() || "",
      projectView: projectView.trim(),
      tools: tools || [],
      platform: platform,
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

  return createSuccessResponse(newProject, "Project created successfully", 201);
});
