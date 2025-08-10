import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/roleUtils";

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
    // Check if user has editor role or is owner
    const { hasAccess } = await checkProjectAccess(user.email, params.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. Editor role required." }, { status: 403 });
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