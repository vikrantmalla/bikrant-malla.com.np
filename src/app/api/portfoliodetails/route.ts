import dbConnect from "@/helpers/lib/dbConnect";
import { NextResponse } from "next/server";
import Behance from "@/models/Behance";
import Contact from "@/models/Contact";
import MetaTag from "@/models/MetaTag";
import AboutMe from "@/models/AboutMe";
import Config from "@/models/Config";
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();
    const [aboutme, behance, contact, metaData, config, project] =
      await Promise.all([
        AboutMe.find({}),
        Behance.find({}),
        Contact.find({}),
        MetaTag.find({}),
        Config.find({}),
        Project.find({}),
      ]);
    const allContent = { aboutme, behance, contact, metaData, config, Project };
    return NextResponse.json(
      {
        success: true,
        ...allContent,
      },
      { status: 200 }
    );
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
