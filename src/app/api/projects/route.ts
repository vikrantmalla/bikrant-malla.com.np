import dbConnect from "@/helpers/lib/dbConnect";
import MetaTag from "@/helpers/models/MetaTag";
import Project from "@/helpers/models/Project";
import TechTag from "@/helpers/models/TechTag";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET() {
  try {
    const allContent = {
      metaData: await MetaTag.find({}),
      techTag: await TechTag.find({}),
      archiveProject: await Project.find().sort({ isnew: -1 }),
    };
    return NextResponse.json({ success: true, ...allContent }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}