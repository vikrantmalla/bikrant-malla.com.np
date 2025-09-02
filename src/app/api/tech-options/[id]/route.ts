import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET - Retrieve specific tech option
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const techOption = await prisma.techOption.findUnique({
      where: { id: params.id }
    });

    if (!techOption) {
      return NextResponse.json({ error: "Tech option not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: techOption
    });
  } catch (error) {
    console.error("Error fetching tech option:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update tech option
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
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // Check if name already exists in the same category (excluding current option)
    const existingOption = await prisma.techOption.findFirst({
      where: {
        name: body.name,
        category: body.category,
        id: { not: params.id }
      }
    });

    if (existingOption) {
      return NextResponse.json(
        { error: "Tech option already exists in this category" },
        { status: 400 }
      );
    }

    const updatedTechOption = await prisma.techOption.update({
      where: { id: params.id },
      data: {
        name: body.name,
        category: body.category,
        description: body.description || null,
        isActive: body.isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTechOption
    });
  } catch (error) {
    console.error("Error updating tech option:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tech option
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const permissionCheck = await checkEditorPermissions();
  
  if (!permissionCheck.success) {
    return permissionCheck.response;
  }

  try {
    // Check if tech option is being used in any projects
    const projectsUsingTech = await prisma.project.findMany({
      where: {
        tools: {
          has: params.id
        }
      }
    });

    if (projectsUsingTech.length > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete tech option. It is being used in projects.",
          projectsCount: projectsUsingTech.length
        },
        { status: 400 }
      );
    }

    await prisma.techOption.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: "Tech option deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting tech option:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
