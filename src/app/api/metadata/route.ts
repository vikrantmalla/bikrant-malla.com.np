import dbConnect from "../../../helpers/lib/dbConnect";
import MetaTag from "@/helpers/models/MetaTag";
import { NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const metaDatas = await MetaTag.find({});
    return NextResponse.json({ success: true, metaTag: metaDatas });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
