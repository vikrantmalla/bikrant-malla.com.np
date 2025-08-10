import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkArchiveProjectAccess } from "@/lib/roleUtils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const archiveProject = await prisma.archiveProject.findUnique({
      where: { id: params.id },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!archiveProject) {
      return NextResponse.json({ error: "Archive project not found" }, { status: 404 });
    }

    // Check if user has access to this archive project
    const { isEditor, isOwner, hasAccess } = await checkArchiveProjectAccess(user.email, params.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      archiveProject,
      userRole: isOwner ? "owner" : "editor"
    });
  } catch (error) {
    console.error("Error fetching archive project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 