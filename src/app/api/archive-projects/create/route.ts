import { NextResponse } from "next/server";
import { checkEditorPermissions, checkPortfolioAccess } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request): Promise<Response> {
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

  if (!permissionCheck.user || !permissionCheck.user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "year",
      "projectView",
      "build",
      "portfolioId",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if user has access to the portfolio
    const { hasAccess } = await checkPortfolioAccess(
      permissionCheck.user!.email,
      body.portfolioId
    );

    if (!hasAccess) {
      return NextResponse.json(
        {
          error:
            "Access denied. You don't have permission to add projects to this portfolio.",
        },
        { status: 403 }
      );
    }

    const newArchiveProject = await prisma.archiveProject.create({
      data: {
        title: body.title,
        year: body.year,
        isNew: body.isNew || false,
        projectView: body.projectView,
        viewCode: body.viewCode,
        build: body.build,
        portfolioId: body.portfolioId,
      },
    });

    return NextResponse.json(
      {
        message: "Archive project created successfully",
        archiveProject: newArchiveProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating archive project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
