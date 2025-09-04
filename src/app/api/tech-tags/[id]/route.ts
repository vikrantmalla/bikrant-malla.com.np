import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET tech tag by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const techTag = await prisma.techTag.findUnique({
      where: {
        id: id,
      },
      include: {
        projectRelations: {
          include: {
            project: true,
          },
        },
        archiveProjectRelations: {
          include: {
            archiveProject: true,
          },
        },
      },
    });

    if (!techTag) {
      return NextResponse.json(
        { error: "Tech tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Tech tag retrieved successfully",
      techTag,
    });
  } catch (error) {
    console.error("Error fetching tech tag:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update tech tag
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const permissionCheck = await checkEditorPermissions();

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
    if (!body.tag || typeof body.tag !== "string") {
      return NextResponse.json(
        { error: "Tag name is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if tag already exists with the new name (case-insensitive, excluding current tag)
    const existingTag = await prisma.techTag.findFirst({
      where: {
        AND: [
          {
            tag: {
              equals: body.tag,
              mode: "insensitive",
            },
          },
          {
            id: {
              not: id,
            },
          },
        ],
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tech tag with this name already exists" },
        { status: 409 }
      );
    }

    // Update tech tag
    const updatedTechTag = await prisma.techTag.update({
      where: {
        id: id,
      },
      data: {
        tag: body.tag.trim(),
      },
    });

    return NextResponse.json({
      message: "Tech tag updated successfully",
      techTag: updatedTechTag,
    });
  } catch (error) {
    console.error("Error updating tech tag:", error);
    // Safely check if the error is an object with a 'code' property of type string
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string" &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Tech tag not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE tech tag
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const permissionCheck = await checkEditorPermissions();

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
    // Check if tech tag is being used by any projects
    const projectUsage = await prisma.projectTag.findFirst({
      where: {
        tagId: id,
      },
    });

    const archiveProjectUsage = await prisma.archiveProjectTag.findFirst({
      where: {
        tagId: id,
      },
    });

    if (projectUsage || archiveProjectUsage) {
      return NextResponse.json(
        {
          error:
            "Cannot delete tech tag. It is currently being used by projects or archive projects.",
        },
        { status: 400 }
      );
    }

    // Delete tech tag
    await prisma.techTag.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Tech tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tech tag:", error);
    if (
      error instanceof Error &&
      (error as unknown as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Tech tag not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
