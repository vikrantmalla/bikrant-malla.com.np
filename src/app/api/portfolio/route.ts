import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request): Promise<Response> {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        projects: true,
        archiveProjects: true,
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}