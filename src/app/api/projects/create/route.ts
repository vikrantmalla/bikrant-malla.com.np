import { NextResponse } from "next/server";
import { checkEditorPermissions, checkPortfolioAccess } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { Platform } from "@/types/enum";

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
      where: { portfolioId: body.portfolioId },
    });

    const totalProjects = existingProjects.length;
    const webProjects = existingProjects.filter(p => p.platform === Platform.Web).length;
    const designProjects = existingProjects.filter(p => p.platform === Platform.Design).length;

    // Validate project limits
    if (totalProjects >= config.maxTotalProjects) {
      return NextResponse.json(
        { error: `Maximum total projects limit reached (${config.maxTotalProjects}). Cannot create more projects.` },
        { status: 400 }
      );
    }

    if (body.platform === Platform.Web && webProjects >= config.maxWebProjects) {
      return NextResponse.json(
        { error: `Maximum Web projects limit reached (${config.maxWebProjects}). Cannot create more Web projects.` },
        { status: 400 }
      );
    }

    if (body.platform === Platform.Design && designProjects >= config.maxDesignProjects) {
      return NextResponse.json(
        { error: `Maximum Design projects limit reached (${config.maxDesignProjects}). Cannot create more Design projects.` },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        subTitle: body.subTitle,
        images: body.images,
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
