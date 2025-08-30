import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET - Retrieve archive project data
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    return NextResponse.json({
      archiveProject
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
    const permissionCheck = await checkEditorPermissions();
  
  if (!permissionCheck.success) {
    return permissionCheck.response;
  }

  try {
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
  const permissionCheck = await checkEditorPermissions();
  
  if (!permissionCheck.success) {
    return permissionCheck.response;
  }

  try {

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