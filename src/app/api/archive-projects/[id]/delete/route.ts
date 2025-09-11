import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkArchiveProjectAccess } from "@/lib/roleUtils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { user } = await getUserFromCookie(request);

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Check if user has editor role or is owner
    const { hasAccess } = await checkArchiveProjectAccess(user.email, id);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied. Editor role required." },
        { status: 403 }
      );
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.archiveProjectTag.deleteMany({
      where: { archiveProjectId: id },
    });

    await prisma.archiveProject.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Archive project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting archive project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
