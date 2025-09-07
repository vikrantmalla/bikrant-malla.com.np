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
    
    // Always return empty portfolio structure on error to prevent infinite loops
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
}