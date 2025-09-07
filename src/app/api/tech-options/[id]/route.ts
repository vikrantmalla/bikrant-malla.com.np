import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET - Retrieve specific tech option
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const techOption = await prisma.techOption.findUnique({
      where: { id: id },
    });

    if (!techOption) {
      return NextResponse.json(
        { error: "Tech option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: techOption,
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
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
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

  try {
    const { id } = await params;
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
        id: { not: id },
      },
    });

    if (existingOption) {
      return NextResponse.json(
        { error: "Tech option already exists in this category" },
        { status: 400 }
      );
    }

    const updatedTechOption = await prisma.techOption.update({
      where: { id: id },
      data: {
        name: body.name,
        category: body.category,
        description: body.description || null,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTechOption,
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
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
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

  try {
    const { id } = await params;
    // Check if tech option is being used in any projects
    const projectsUsingTech = await prisma.project.findMany({
      where: {
        tools: {
          has: id,
        },
      },
    });

    if (projectsUsingTech.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete tech option. It is being used in projects.",
          projectsCount: projectsUsingTech.length,
        },
        { status: 400 }
      );
    }

    await prisma.techOption.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: "Tech option deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tech option:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
