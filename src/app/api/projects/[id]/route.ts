import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET - Retrieve project data
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update project data (only editors and owners)
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
    const requiredFields = ["title", "projectView", "tools"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subTitle: body.subTitle,
        images: body.images,
        imageUrl: body.imageUrl,
        alt: body.alt,
        projectView: body.projectView,
        tools: body.tools,
        platform: body.platform,
      },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete project (only editors and owners)
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
    await prisma.projectTag.deleteMany({
      where: { projectId: params.id },
    });

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
