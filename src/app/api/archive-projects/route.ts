import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET(request: Request): Promise<Response> {
  const permissionCheck = await checkEditorPermissions(request);

  if (!permissionCheck.success) {
    // If permissionCheck.success is false, permissionCheck.response should contain an error response.
    // The lint error indicates that permissionCheck.response might be null, which is not a valid Response.
    // We must ensure a valid NextResponse is returned.
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      // This case implies the permission check failed but did not provide a specific error response.
      // Return a generic internal server error to ensure a valid Response is always returned.
      return NextResponse.json(
        { error: "Permission check failed unexpectedly." },
        { status: 500 }
      );
    }
  }

  const user = permissionCheck.user;

  if (!user || !user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { roles: true },
    });

    // If user doesn't exist, create them
    if (!dbUser) {
      // This should not happen with the new auth system as users are created during registration
      // But keeping this as a fallback for migration purposes
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

    // Check all portfolios
    const allPortfolios = await prisma.portfolio.findMany({
      select: { id: true, name: true, ownerEmail: true },
    });

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

    // If still no portfolio, assign the first available portfolio to this user
    if (!portfolio && allPortfolios.length > 0) {
      const firstPortfolio = allPortfolios[0];

      // Create user portfolio role
      await prisma.userPortfolioRole.create({
        data: {
          userId: dbUser.id,
          portfolioId: firstPortfolio.id,
          role: "OWNER",
        },
      });

      portfolio = await prisma.portfolio.findUnique({
        where: { id: firstPortfolio.id },
      });
    }

    if (!portfolio) {
      return NextResponse.json(
        {
          error: "No portfolio found for user",
          message: "User doesn't have access to any portfolio",
          debug: {
            userEmail: user.email,
            dbUserExists: !!dbUser,
            totalPortfolios: allPortfolios.length,
            portfolios: allPortfolios,
          },
        },
        { status: 404 }
      );
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

    return NextResponse.json({
      message: "Archive projects retrieved successfully",
      archiveProjects,
      portfolio: {
        id: portfolio.id,
        name: portfolio.name,
      },
    });
  } catch (error) {
    console.error("Error fetching archive projects:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch archive projects",
      },
      { status: 500 }
    );
  }
}
