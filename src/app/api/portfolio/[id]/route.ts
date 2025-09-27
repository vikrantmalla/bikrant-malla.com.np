import { NextRequest } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { withPublicRateLimit, withAdminRateLimit } from "@/lib/api-utils";
import {
  createSuccessResponse,
  NotFoundError,
  ConflictError,
  AuthorizationError,
} from "@/lib/api-errors";
import {
  createPortfolioSchema,
  validateRequest,
  objectIdSchema,
} from "@/lib/validation";

// GET portfolio by ID
export const GET = withPublicRateLimit(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;

    // Validate ObjectId
    const idValidation = objectIdSchema.safeParse(id);
    if (!idValidation.success) {
      throw new NotFoundError("Invalid portfolio ID format");
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: id },
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
      throw new NotFoundError("Portfolio not found");
    }

    return createSuccessResponse(portfolio, "Portfolio retrieved successfully");
  }
);

// PUT update portfolio
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
      throw new NotFoundError("Invalid portfolio ID format");
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

    // Check if portfolio exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id: id },
    });

    if (!existingPortfolio) {
      throw new NotFoundError("Portfolio not found");
    }

    // Check if user is the portfolio owner
    if (existingPortfolio.ownerEmail !== permissionCheck.user.email) {
      throw new AuthorizationError("You can only update your own portfolio");
    }

    // Check if ownerEmail is being changed to a different user
    if (ownerEmail !== existingPortfolio.ownerEmail) {
      // Check if another portfolio exists for the new owner
      const conflictingPortfolio = await prisma.portfolio.findFirst({
        where: {
          ownerEmail: ownerEmail,
          id: { not: id },
        },
      });

      if (conflictingPortfolio) {
        throw new ConflictError("Portfolio already exists for this user");
      }
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: id },
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
      include: {
        projects: true,
        archiveProjects: true,
      },
    });

    return createSuccessResponse(
      updatedPortfolio,
      "Portfolio updated successfully"
    );
  }
);

// DELETE portfolio
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
      throw new NotFoundError("Invalid portfolio ID format");
    }

    // Check if portfolio exists and user is the owner
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: id },
    });

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found");
    }

    if (portfolio.ownerEmail !== permissionCheck.user.email) {
      throw new AuthorizationError(
        "Only portfolio owners can delete portfolios"
      );
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.userPortfolioRole.deleteMany({
      where: { portfolioId: id },
    });

    await prisma.portfolio.delete({
      where: { id: id },
    });

    return createSuccessResponse(null, "Portfolio deleted successfully");
  }
);
