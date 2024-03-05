import dbConnect from "../../../helpers/lib/dbConnect";
import MetaTag from "@/helpers/models/MetaTag";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const metaDatas = await MetaTag.find({});
    return NextResponse.json(
      { success: true, metaTag: metaDatas },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const metaTag = await new MetaTag(body);
    await metaTag.save();
    return NextResponse.json(
      { success: true, metaTag, message: "Metadata created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updatedData } = body;

    const updatedMetaTag = await MetaTag.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });

    if (updatedMetaTag) {
      return NextResponse.json(
        {
          success: true,
          metaTag: updatedMetaTag,
          message: "Metadata updated successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Metadata not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();

    const deletedMetaTag = await MetaTag.findByIdAndDelete(_id);

    if (deletedMetaTag) {
      return NextResponse.json(
        { success: true, message: "Metadata deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Metadata not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
