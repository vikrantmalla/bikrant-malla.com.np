import dbConnect from "@/helpers/lib/dbConnect";
import Contact from "@/helpers/models/Contact";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function GET() {
  try {
    const contactDetails = await Contact.find({});
    return NextResponse.json(
      { success: true, contact: contactDetails },
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
    const contactDetails = await new Contact(body);
    await contactDetails.save();
    return NextResponse.json(
      {
        success: true,
        contactDetails,
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

    const updatedContactDetails = await await Contact.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );

    if (updatedContactDetails) {
      return NextResponse.json(
        {
          success: true,
          behanceProject: updatedContactDetails,
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

    const deletedContactDetails = await Contact.findByIdAndDelete(_id);

    if (deletedContactDetails) {
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