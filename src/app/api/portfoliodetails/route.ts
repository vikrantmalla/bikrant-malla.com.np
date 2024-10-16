import dbConnect from "@/helpers/lib/dbConnect";
import Aboutme from "@/models/AboutMe";
import Behance from "@/models/Behance";
import Contact from "@/models/Contact";
import MetaTag from "@/models/MetaTag";
import Project from "@/models/ProjectHighlight";
import Config from "@/models/Config";
import { NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const allContent = {
      aboutme: await Aboutme.find({}),
      behance: await Behance.find({}),
      contact: await Contact.find({}),
      metaData: await MetaTag.find({}),
      project: await Project.find({}),
      config: await Config.find({})
    };
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
