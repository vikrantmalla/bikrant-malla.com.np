import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkPortfolioAccess } from "@/lib/roleUtils";

export async function GET(
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
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: id },
      include: {
        projects: {
          include: {
            tagRelations: {
              include: {
                tag: true,
              },
            },
          },
        },
        archiveProjects: {
          include: {
            tagRelations: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this portfolio
    const { isEditor, isOwner, hasAccess } = await checkPortfolioAccess(
      user.email,
      id
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      portfolio,
      userRole: isOwner ? "OWNER" : "EDITOR",
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
