import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkArchiveProjectAccess } from "@/lib/roleUtils";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromCookie();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Check if user has editor role or is owner
    const { hasAccess } = await checkArchiveProjectAccess(user.email, id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. Editor role required." }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'year', 'projectView', 'build'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const updatedArchiveProject = await prisma.archiveProject.update({
      where: { id: id },
      data: {
        title: body.title,
        year: body.year,
        isNew: body.isNew || false,
        projectView: body.projectView,
        viewCode: body.viewCode,
        build: body.build,
      }
    });

    return NextResponse.json({
      message: "Archive project updated successfully",
      archiveProject: updatedArchiveProject
    });
  } catch (error) {
    console.error("Error updating archive project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 