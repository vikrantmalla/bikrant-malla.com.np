import dbConnect from "@/helpers/lib/dbConnect";
import Aboutme from "@/helpers/models/Aboutme";
import Behance from "@/helpers/models/Behance";
import Contact from "@/helpers/models/Contact";
import MetaTag from "@/helpers/models/MetaTag";
import Project from "@/helpers/models/ProjectHighlight";
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
