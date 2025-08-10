import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkPortfolioAccess } from "@/lib/roleUtils";

export async function POST(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'year', 'projectView', 'build', 'portfolioId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if user has access to the portfolio
    const { hasAccess } = await checkPortfolioAccess(user.email, body.portfolioId);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. You don't have permission to add archive projects to this portfolio." }, { status: 403 });
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
      }
    });

    return NextResponse.json({
      message: "Archive project created successfully",
      archiveProject: newArchiveProject
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating archive project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 