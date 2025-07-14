import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!user || user.email !== process.env.PORTFOLIO_OWNER_EMAIL || token !== process.env.PORTFOLIO_OWNER_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { ownerEmail: user.email },
      include: {
        projects: true,
        archiveProjects: true,
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({
      portfolio,
      projects: portfolio.projects,
      archiveProjects: portfolio.archiveProjects,
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}