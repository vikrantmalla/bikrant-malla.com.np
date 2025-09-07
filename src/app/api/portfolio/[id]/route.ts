import { NextResponse, NextRequest } from "next/server";
import { checkSecureEditorPermissions } from "@/lib/secure-auth";
import { prisma } from "@/lib/prisma";

// GET - Retrieve portfolio data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
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
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      portfolio,
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update portfolio data (only editors and owners)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const permissionCheck = await checkSecureEditorPermissions(request);

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

  if (!permissionCheck.user || !permissionCheck.user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "jobTitle",
      "aboutDescription1",
      "email",
      "ownerEmail",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: id },
      data: {
        name: body.name,
        jobTitle: body.jobTitle,
        aboutDescription1: body.aboutDescription1,
        aboutDescription2: body.aboutDescription2,
        skills: body.skills || [],
        email: body.email,
        linkedIn: body.linkedIn,
        gitHub: body.gitHub,
        facebook: body.facebook,
        instagram: body.instagram,
      },
      include: {
        projects: true,
        archiveProjects: true,
      },
    });

    return NextResponse.json({
      message: "Portfolio updated successfully",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete portfolio (only owners can delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const permissionCheck = await checkSecureEditorPermissions(request);

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

  if (!permissionCheck.user || !permissionCheck.user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { id } = await params;
    // Check if user is the portfolio owner
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: id },
    });

    if (
      !portfolio ||
      portfolio.ownerEmail !== permissionCheck.user?.email
    ) {
      return NextResponse.json(
        {
          error: "Access denied. Only portfolio owners can delete portfolios.",
        },
        { status: 403 }
      );
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.userPortfolioRole.deleteMany({
      where: { portfolioId: id },
    });

    await prisma.portfolio.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
