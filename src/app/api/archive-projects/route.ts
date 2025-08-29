import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("User email:", user.email);
    
    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { roles: true }
    });
    
    // If user doesn't exist, create them
    if (!dbUser) {
      console.log("Creating new user for:", user.email);
      dbUser = await prisma.user.create({
        data: {
          kindeUserId: user.id || `kinde_${Date.now()}`,
          email: user.email,
          name: user.given_name || user.family_name || user.email.split('@')[0]
        },
        include: { roles: true }
      });
      console.log("Created user:", dbUser.id);
    }
    
    console.log("Database user found:", !!dbUser);
    console.log("User roles:", dbUser.roles.length);
    
    // Check all portfolios
    const allPortfolios = await prisma.portfolio.findMany({
      select: { id: true, name: true, ownerEmail: true }
    });
    console.log("Total portfolios in database:", allPortfolios.length);
    
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
      console.log("Assigning user to first portfolio:", firstPortfolio.id);
      
      // Create user portfolio role
      await prisma.userPortfolioRole.create({
        data: {
          userId: dbUser.id,
          portfolioId: firstPortfolio.id,
          role: "owner"
        }
      });
      
      portfolio = await prisma.portfolio.findUnique({
        where: { id: firstPortfolio.id }
      });
    }

    if (!portfolio) {
      console.log("No portfolio found for user:", user.email);
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

    console.log("Found portfolio:", portfolio.id);

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

    console.log("Found archive projects:", archiveProjects.length);

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
