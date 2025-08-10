import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkPortfolioAccess } from "@/lib/roleUtils";

// GET - Retrieve portfolio data
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id },
      include: {
        projects: {
          include: {
            tagRelations: {
              include: {
                tag: true
              }
            }
          }
        },
        archiveProjects: {
          include: {
            tagRelations: {
              include: {
                tag: true
              }
            }
          }
        }
      }
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Check if user has access to this portfolio
    const { isEditor, isOwner, hasAccess } = await checkPortfolioAccess(user.email, params.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      portfolio,
      userRole: isOwner ? "owner" : "editor"
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update portfolio data (only editors and owners)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if user has editor role or is owner
    const { hasAccess } = await checkPortfolioAccess(user.email, params.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. Editor role required." }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'jobTitle', 'aboutDescription1', 'email', 'ownerEmail'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: params.id },
      data: {
        name: body.name,
        jobTitle: body.jobTitle,
        aboutDescription1: body.aboutDescription1,
        aboutDescription2: body.aboutDescription2,
        skills: body.skills || [],
        email: body.email,
        phone: body.phone,
        linkedIn: body.linkedIn,
        gitHub: body.gitHub,
        facebook: body.facebook,
        instagram: body.instagram,
      },
      include: {
        projects: true,
        archiveProjects: true,
      }
    });

    return NextResponse.json({
      message: "Portfolio updated successfully",
      portfolio: updatedPortfolio
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete portfolio (only owners can delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Only owners can delete portfolios
    const { isOwner } = await checkPortfolioAccess(user.email, params.id);

    if (!isOwner) {
      return NextResponse.json({ error: "Access denied. Only portfolio owners can delete portfolios." }, { status: 403 });
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.userPortfolioRole.deleteMany({
      where: { portfolioId: params.id }
    });

    await prisma.portfolio.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: "Portfolio deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 