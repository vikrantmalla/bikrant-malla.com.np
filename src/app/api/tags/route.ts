import dbConnect from "@/helpers/lib/dbConnect";
import Project from "@/helpers/models/Project";
import TechTag from "@/helpers/models/TechTag";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET() {
  try {
    const techTags = await TechTag.find();
    return NextResponse.json(
      { success: true,  techTag: techTags },
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
    const techTag = await new TechTag(body);
    await techTag.save();
    return NextResponse.json(
      {
        success: true,
        techTag,
        message: "Tech tag created successfully",
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

    const updatedTechTag = await TechTag.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );

    if (updatedTechTag) {
      return NextResponse.json(
        {
          success: true,
          techTag: updatedTechTag,
          message: "Tech tag updated successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Tech tag not found" },
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

    const deletedTechTag = await TechTag.findByIdAndDelete(_id);

    if (deletedTechTag) {
      return NextResponse.json(
        {
          success: true,
          message: "Tech tag deleted successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Tech tag not found" },
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