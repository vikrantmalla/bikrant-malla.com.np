import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

// Get config
export async function GET() {
  try {
    let config = await prisma.config.findFirst();
    
    if (!config) {
      // Create default config if none exists
      config = await prisma.config.create({
        data: {
          maxWebProjects: 6,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        },
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update config
export async function PUT(request: Request) {
  const permissionCheck = await checkEditorPermissions();
  
  if (!permissionCheck.success) {
    return permissionCheck.response;
  }
  
  try {
    const body = await request.json();
    
    let config = await prisma.config.findFirst();
    
    if (!config) {
      config = await prisma.config.create({
        data: {
          maxWebProjects: body.maxWebProjects || 6,
          maxDesignProjects: body.maxDesignProjects || 6,
          maxTotalProjects: body.maxTotalProjects || 12,
        },
      });
    } else {
      config = await prisma.config.update({
        where: { id: config.id },
        data: {
          maxWebProjects: body.maxWebProjects,
          maxDesignProjects: body.maxDesignProjects,
          maxTotalProjects: body.maxTotalProjects,
        },
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error updating config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
