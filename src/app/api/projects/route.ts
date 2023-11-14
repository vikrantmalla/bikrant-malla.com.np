import dbConnect from "@/helpers/lib/dbConnect";
import Project from "@/helpers/models/Project";
import { NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const projects = await Project.find().sort({ isnew: -1 });
    return NextResponse.json({
      success: true,
      projectHighlights: projects,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
