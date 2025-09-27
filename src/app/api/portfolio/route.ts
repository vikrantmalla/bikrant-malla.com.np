import { NextRequest, NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import {
  withApiErrorHandler,
  withPublicRateLimit,
  withAdminRateLimit,
} from "@/lib/api-utils";
import {
  createSuccessResponse,
  NotFoundError,
  ConflictError,
} from "@/lib/api-errors";
import { createPortfolioSchema, validateRequest } from "@/lib/validation";

// GET portfolio data
export const GET = withPublicRateLimit(async (request: NextRequest) => {
  const portfolio = await prisma.portfolio.findFirst({
    include: {
      projects: {
        include: {
          tagRelations: {
            include: {
              tag: true,
            },
          },
        },
      },
      archiveProjects: {
        include: {
          tagRelations: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });

  if (!portfolio) {
    // Return empty portfolio structure instead of 404 error
    const emptyPortfolio = {
      id: null,
      name: "",
      jobTitle: "",
      aboutDescription1: "",
      aboutDescription2: "",
      skills: [],
      email: "",
      ownerEmail: "",
      linkedIn: "",
      gitHub: "",
      behance: "",
      twitter: "",
      projects: [],
      archiveProjects: [],
      userRoles: [],
    };
    return createSuccessResponse(
      emptyPortfolio,
      "Portfolio data retrieved successfully"
    );
  }

  return createSuccessResponse(
    portfolio,
    "Portfolio data retrieved successfully"
  );
});

// POST create new portfolio
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
  const validation = validateRequest(createPortfolioSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const {
    name,
    jobTitle,
    aboutDescription1,
    aboutDescription2,
    skills,
    ownerEmail,
    linkedIn,
    gitHub,
    behance,
    twitter,
  } = validation.data;

  // Check if user is creating portfolio for themselves
  if (ownerEmail !== permissionCheck.user!.email) {
    throw new ConflictError("You can only create portfolios for yourself");
  }

  // Check if portfolio already exists for this user
  const existingPortfolio = await prisma.portfolio.findFirst({
    where: {
      ownerEmail: ownerEmail,
    },
  });

  if (existingPortfolio) {
    throw new ConflictError("Portfolio already exists for this user");
  }

  // Create new portfolio
  const newPortfolio = await prisma.portfolio.create({
    data: {
      name: name.trim(),
      jobTitle: jobTitle.trim(),
      aboutDescription1: aboutDescription1.trim(),
      aboutDescription2: aboutDescription2?.trim() || "",
      skills: skills || [],
      ownerEmail: ownerEmail.trim(),
      linkedIn: linkedIn?.trim() || "",
      gitHub: gitHub?.trim() || "",
      behance: behance?.trim() || "",
      twitter: twitter?.trim() || "",
    },
  });

  return createSuccessResponse(
    newPortfolio,
    "Portfolio created successfully",
    201
  );
});
