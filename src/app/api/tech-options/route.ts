import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET - Retrieve all tech options
export async function GET() {
  try {
    const techOptions = await prisma.techOption.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: techOptions,
    });
  } catch (error) {
    console.error("Error fetching tech options:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new tech option
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
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // Check if tech option already exists
    const existingOption = await prisma.techOption.findFirst({
      where: {
        name: body.name,
        category: body.category,
      },
    });

    if (existingOption) {
      return NextResponse.json(
        { error: "Tech option already exists in this category" },
        { status: 400 }
      );
    }

    const newTechOption = await prisma.techOption.create({
      data: {
        name: body.name,
        category: body.category,
        description: body.description || null,
        isActive: body.isActive !== false, // Default to true
      },
    });

    return NextResponse.json({
      success: true,
      data: newTechOption,
    });
  } catch (error) {
    console.error("Error creating tech option:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
