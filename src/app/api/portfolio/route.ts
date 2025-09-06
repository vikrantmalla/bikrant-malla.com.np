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
      // Return empty portfolio structure instead of 404 error
      return NextResponse.json({
        id: null,
        name: "",
        jobTitle: "",
        aboutDescription1: "",
        aboutDescription2: "",
        skills: [],
        email: "",
        ownerEmail: "",
        linkedIn: "",
        gitHub: "",
        facebook: "",
        instagram: "",
        projects: [],
        archiveProjects: [],
        userRoles: []
      });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Portfolio API error:", error);
    
    // Handle database authentication errors specifically
    if (error instanceof Error && error.message.includes('authentication failed')) {
      console.error("Database authentication failed - returning empty portfolio");
      return NextResponse.json({
        id: null,
        name: "",
        jobTitle: "",
        aboutDescription1: "",
        aboutDescription2: "",
        skills: [],
        email: "",
        ownerEmail: "",
        linkedIn: "",
        gitHub: "",
        facebook: "",
        instagram: "",
        projects: [],
        archiveProjects: [],
        userRoles: []
      });
    }
    
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}