import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

// GET tech tag by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const techTag = await prisma.techTag.findUnique({
      where: {
        id: params.id
      },
      include: {
        projectRelations: {
          include: {
            project: true
          }
        },
        archiveProjectRelations: {
          include: {
            archiveProject: true
          }
        }
      }
    });

    if (!techTag) {
      return NextResponse.json({ error: "Tech tag not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Tech tag retrieved successfully",
      techTag
    });
  } catch (error) {
    console.error("Error fetching tech tag:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update tech tag
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
    const body = await request.json();
    
    // Validate required fields
    if (!body.tag || typeof body.tag !== 'string') {
      return NextResponse.json({ error: "Tag name is required and must be a string" }, { status: 400 });
    }

    // Check if tag already exists with the new name (case-insensitive, excluding current tag)
    const existingTag = await prisma.techTag.findFirst({
      where: {
        AND: [
          {
            tag: {
              equals: body.tag,
              mode: 'insensitive'
            }
          },
          {
            id: {
              not: params.id
            }
          }
        ]
      }
    });

    if (existingTag) {
      return NextResponse.json({ error: "Tech tag with this name already exists" }, { status: 409 });
    }

    // Update tech tag
    const updatedTechTag = await prisma.techTag.update({
      where: {
        id: params.id
      },
      data: {
        tag: body.tag.trim()
      }
    });

    return NextResponse.json({
      message: "Tech tag updated successfully",
      techTag: updatedTechTag
    });
  } catch (error) {
    console.error("Error updating tech tag:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Tech tag not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE tech tag
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
    // Check if tech tag is being used by any projects
    const projectUsage = await prisma.projectTag.findFirst({
      where: {
        tagId: params.id
      }
    });

    const archiveProjectUsage = await prisma.archiveProjectTag.findFirst({
      where: {
        tagId: params.id
      }
    });

    if (projectUsage || archiveProjectUsage) {
      return NextResponse.json({ 
        error: "Cannot delete tech tag. It is currently being used by projects or archive projects." 
      }, { status: 400 });
    }

    // Delete tech tag
    await prisma.techTag.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      message: "Tech tag deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting tech tag:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Tech tag not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
