import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get the portfolio with projects and archive projects
    const portfolio = await prisma.portfolio.findFirst({
      include: {
        projects: {
          include: {
            tagRelations: {
              include: {
                tag: true
              }
            }
          }
        },
        archiveProjects: {
          include: {
            tagRelations: {
              include: {
                tag: true
              }
            }
          }
        }
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Get all tech tags
    const techTags = await prisma.techTag.findMany();

    // Provide fallback metadata since MetaTag model doesn't exist in the database
    const fallbackMetaData = [{
      id: "fallback",
      title: "Archive - Bikrant Malla",
      description: "A list of projects and work by Bikrant Malla",
      keyword: "portfolio, projects, archive, Bikrant Malla",
      author: "Bikrant Malla",
      fbID: "",
      twitterID: ""
    }];

    // Transform the data to match ArchiveDetailsData interface
    const archiveData = {
      success: true,
      metaData: fallbackMetaData,
      techTag: techTags,
      archiveProject: portfolio.archiveProjects
    };

    return NextResponse.json(archiveData);
  } catch (error) {
    console.error("Error fetching archive data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
