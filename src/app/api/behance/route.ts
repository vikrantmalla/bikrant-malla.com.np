import dbConnect from "@/helpers/lib/dbConnect";
import Behance from "@/helpers/models/Behance";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const behanceHighlights = await Behance.find({});
    return NextResponse.json(
      { success: true, behanceProject: behanceHighlights },
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
    const behanceHighlight = await new Behance(body);
    await behanceHighlight.save();
    return NextResponse.json(
      {
        success: true,
        behanceHighlight,
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

    const updatedBehanceHighlightData = await Behance.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );

    if (updatedBehanceHighlightData) {
      return NextResponse.json(
        {
          success: true,
          behanceProject: updatedBehanceHighlightData,
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

    const deletedBehanceHighlightData = await Behance.findByIdAndDelete(_id);

    if (deletedBehanceHighlightData) {
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