import { NextResponse } from "next/server";
import { checkEditorPermissions, checkPortfolioAccess } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const permissionCheck = await checkEditorPermissions();
  
  if (!permissionCheck.success) {
    return permissionCheck.response;
  }
  
  if (!permissionCheck.kindeUser || !permissionCheck.kindeUser.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["title", "projectView", "tools", "portfolioId"];
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
      permissionCheck.kindeUser!.email,
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

    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        subTitle: body.subTitle,
        images: body.images,
        imageUrl: body.imageUrl,
        alt: body.alt,
        projectView: body.projectView,
        tools: body.tools,
        platform: body.platform,
        portfolioId: body.portfolioId,
      },
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
