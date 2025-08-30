import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const permissionCheck = await checkEditorPermissions();
  
  if (!permissionCheck.success) {
    return permissionCheck.response;
  }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'projectView', 'tools'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
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
      }
    });

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 