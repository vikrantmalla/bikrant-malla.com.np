import dbConnect from "@/helpers/lib/dbConnect";
import Projecthighlight from "@/helpers/models/ProjectHighlight";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET() {
  try {
    const projecthighlights = await Projecthighlight.find({});
    return NextResponse.json(
      { success: true, projectHighlights: projecthighlights },
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
    const projecthighlight = await new Projecthighlight(body);
    await projecthighlight.save();
    return NextResponse.json(
      {
        success: true,
        projecthighlight,
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

    const updatedProjecthighlightData = await Projecthighlight.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );

    if (updatedProjecthighlightData) {
      return NextResponse.json(
        {
          success: true,
          behanceProject: updatedProjecthighlightData,
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

    const deletedProjecthighlightData = await Projecthighlight.findByIdAndDelete(_id);

    if (deletedProjecthighlightData) {
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