import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// GET - Retrieve all tech options
export async function GET() {
  try {
    const techOptions = await prisma.techOption.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: techOptions
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
export async function POST(request: Request) {
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

    // Check if tech option already exists
    const existingOption = await prisma.techOption.findFirst({
      where: {
        name: body.name,
        category: body.category
      }
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
        isActive: body.isActive !== false // Default to true
      }
    });

    return NextResponse.json({
      success: true,
      data: newTechOption
    });
  } catch (error) {
    console.error("Error creating tech option:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
