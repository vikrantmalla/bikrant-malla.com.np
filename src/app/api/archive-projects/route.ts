import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's portfolio first
    const userPortfolio = await prisma.userPortfolioRole.findFirst({
      where: { 
        user: { kindeUserId: user.id }
      },
      include: { portfolio: true }
    });

    if (!userPortfolio) {
      return NextResponse.json({ error: "No portfolio found for user" }, { status: 404 });
    }

    const archiveProjects = await prisma.archiveProject.findMany({
      where: { portfolioId: userPortfolio.portfolioId },
      include: {
        portfolio: true,
        tagRelations: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(archiveProjects);
  } catch (error) {
    console.error("Error fetching archive projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
