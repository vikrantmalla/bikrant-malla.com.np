import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkArchiveProjectAccess } from "@/lib/roleUtils";

// GET - Retrieve archive project data
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
    const archiveProject = await prisma.archiveProject.findUnique({
      where: { id: params.id },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!archiveProject) {
      return NextResponse.json({ error: "Archive project not found" }, { status: 404 });
    }

    // Check if user has access to this archive project
    const { isEditor, isOwner, hasAccess } = await checkArchiveProjectAccess(user.email, params.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      archiveProject,
      userRole: isOwner ? "owner" : "editor"
    });
  } catch (error) {
    console.error("Error fetching archive project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update archive project data (only editors and owners)
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
    const { isEditor, isOwner, hasAccess } = await checkArchiveProjectAccess(user.email, params.id);

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
      where: { id: params.id },
      data: {
        title: body.title,
        year: body.year,
        isNew: body.isNew || false,
        projectView: body.projectView,
        viewCode: body.viewCode,
        build: body.build,
      },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true
          }
        }
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

// DELETE - Delete archive project (only editors and owners)
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
    // Check if user has editor role or is owner
    const { hasAccess } = await checkArchiveProjectAccess(user.email, params.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. Editor role required." }, { status: 403 });
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.archiveProjectTag.deleteMany({
      where: { archiveProjectId: params.id }
    });

    await prisma.archiveProject.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: "Archive project deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting archive project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 