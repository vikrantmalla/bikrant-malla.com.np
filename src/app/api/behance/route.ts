import dbConnect from "@/helpers/lib/dbConnect";
import Behance from "@/helpers/models/Behance";
import { NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const behancehighlights = await Behance.find({});
    return NextResponse.json({ success: true, behanceProject: behancehighlights });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
