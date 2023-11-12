import dbConnect from "@/helpers/lib/dbConnect";
import Projecthighlight from "@/helpers/models/ProjectHighlight";
import { NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const projecthighlights = await Projecthighlight.find({});
    return NextResponse.json({
      success: true,
      projectHighlights: projecthighlights,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
