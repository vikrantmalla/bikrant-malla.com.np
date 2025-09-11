import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkArchiveProjectAccess } from "@/lib/roleUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await getUserFromCookie(request);

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const archiveProject = await prisma.archiveProject.findUnique({
      where: { id: id },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!archiveProject) {
      return NextResponse.json(
        { error: "Archive project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this archive project
    const { isEditor, isOwner, hasAccess } = await checkArchiveProjectAccess(
      user.email,
      id
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      archiveProject,
      userRole: isOwner ? "OWNER" : "EDITOR",
    });
  } catch (error) {
    console.error("Error fetching archive project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
