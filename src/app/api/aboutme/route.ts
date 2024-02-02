import dbConnect from "../../../helpers/lib/dbConnect";
import Aboutme from "../../../helpers/models/Aboutme";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const aboutmeDetails = await Aboutme.find({});
    return NextResponse.json(
      { success: true, aboutme: aboutmeDetails },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const aboutme = await new Aboutme(body);
    await aboutme.save();
    return NextResponse.json(
      {
        success: true,
        aboutme,
        message: "Data saved successfully",
      },
      { status: 201 }
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
