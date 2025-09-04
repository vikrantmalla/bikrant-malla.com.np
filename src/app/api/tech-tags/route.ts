import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET all tech tags
export async function GET() {
  try {
    const techTags = await prisma.techTag.findMany({
      orderBy: {
        tag: "asc",
      },
    });

    return NextResponse.json({
      message: "Tech tags retrieved successfully",
      techTags,
    });
  } catch (error) {
    console.error("Error fetching tech tags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new tech tag
export async function POST(request: Request): Promise<Response> {
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
    const body = await request.json();

    // Validate required fields
    if (!body.tag || typeof body.tag !== "string") {
      return NextResponse.json(
        { error: "Tag name is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if tag already exists (case-insensitive)
    const existingTag = await prisma.techTag.findFirst({
      where: {
        tag: {
          equals: body.tag,
          mode: "insensitive",
        },
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tech tag already exists" },
        { status: 409 }
      );
    }

    // Create new tech tag
    const newTechTag = await prisma.techTag.create({
      data: {
        tag: body.tag.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Tech tag created successfully",
        techTag: newTechTag,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tech tag:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
