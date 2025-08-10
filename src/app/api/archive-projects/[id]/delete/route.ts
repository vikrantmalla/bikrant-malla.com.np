import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkArchiveProjectAccess } from "@/lib/roleUtils";

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
    // Check if user has editor role or is owner
    const { hasAccess } = await checkArchiveProjectAccess(user.email, params.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. Editor role required." }, { status: 403 });
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.archiveProjectTag.deleteMany({
      where: { archiveProjectId: params.id }
    });

    await prisma.archiveProject.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: "Archive project deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting archive project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 