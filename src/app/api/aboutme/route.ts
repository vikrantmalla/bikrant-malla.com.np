import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import Aboutme from "../../../helpers/models/Aboutme";
import { NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const aboutmeDetails = await Aboutme.find({});
    return NextResponse.json({ success: true, aboutme: aboutmeDetails });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}