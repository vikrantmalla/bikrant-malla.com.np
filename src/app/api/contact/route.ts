import dbConnect from "@/helpers/lib/dbConnect";
import Contact from "@/helpers/models/Contact";
import { NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const contactDetails = await Contact.find({});
    return NextResponse.json({ success: true, contact: contactDetails });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
