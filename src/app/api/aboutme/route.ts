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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updatedData } = body;

    const updatedAboutmeData = await Aboutme.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );

    if (updatedAboutmeData) {
      return NextResponse.json(
        {
          success: true,
          aboutme: updatedAboutmeData,
          message: "Data updated successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Data not found" },
        { status: 404 }
      );
    }
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

export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();

    const deletedAboutmeData = await Aboutme.findByIdAndDelete(_id);

    if (deletedAboutmeData) {
      return NextResponse.json(
        {
          success: true,
          message: "Data deleted successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Data not found" },
        { status: 404 }
      );
    }
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
