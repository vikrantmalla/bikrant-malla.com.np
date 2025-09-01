import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const permissionCheck = await checkEditorPermissions();
  
  if (!permissionCheck.success) {
    return permissionCheck.response;
  }
  
  const user = permissionCheck.kindeUser;
  const dbUser = permissionCheck.user;
  
  if (!user || !user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  try {
    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { roles: true }
    });
    
    // If user doesn't exist, create them
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          kindeUserId: `kinde_${Date.now()}`,
          email: user.email,
          name: user.given_name || user.family_name || user.email.split('@')[0]
        },
        include: { roles: true }
      });
    }
    
    // Check all portfolios
    const allPortfolios = await prisma.portfolio.findMany({
      select: { id: true, name: true, ownerEmail: true }
    });
    
    // First, try to find a portfolio owned by this user
    let portfolio = await prisma.portfolio.findFirst({
      where: { 
        ownerEmail: user.email 
      }
    });

    // If no portfolio found, try to find one where user has a role
    if (!portfolio) {
      const userRole = await prisma.userPortfolioRole.findFirst({
        where: { 
          userId: dbUser.id
        },
        include: { portfolio: true }
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
          role: "OWNER"
        }
      });
      
      portfolio = await prisma.portfolio.findUnique({
        where: { id: firstPortfolio.id }
      });
    }

    if (!portfolio) {
      return NextResponse.json({ 
        error: "No portfolio found for user",
        message: "User doesn't have access to any portfolio",
        debug: {
          userEmail: user.email,
          dbUserExists: !!dbUser,
          totalPortfolios: allPortfolios.length,
          portfolios: allPortfolios
        }
      }, { status: 404 });
    }

    const archiveProjects = await prisma.archiveProject.findMany({
      where: { portfolioId: portfolio.id },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true }
        }
      }
    });

    return NextResponse.json({
      message: "Archive projects retrieved successfully",
      archiveProjects,
      portfolio: {
        id: portfolio.id,
        name: portfolio.name
      }
    });
  } catch (error) {
    console.error("Error fetching archive projects:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: "Failed to fetch archive projects"
    }, { status: 500 });
  }
}
