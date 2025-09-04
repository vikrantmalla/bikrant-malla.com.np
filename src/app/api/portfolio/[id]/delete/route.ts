import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkPortfolioAccess } from "@/lib/roleUtils";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Only owners can delete portfolios
    const { isOwner } = await checkPortfolioAccess(user.email, id);

    if (!isOwner) {
      return NextResponse.json(
        {
          error: "Access denied. Only portfolio owners can delete portfolios.",
        },
        { status: 403 }
      );
    }

    // Delete related data first (due to foreign key constraints)
    await prisma.userPortfolioRole.deleteMany({
      where: { portfolioId: id },
    });

    await prisma.portfolio.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
