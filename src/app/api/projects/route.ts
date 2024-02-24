import dbConnect from "@/helpers/lib/dbConnect";
import Project from "@/helpers/models/Project";
import TechTag from "@/helpers/models/TechTag";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET() {
  try {
    const techTags = await TechTag.find();
    const projects = await Project.find().sort({ isnew: -1 });
    return NextResponse.json(
      { success: true,  project: projects, techTag: techTags},
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
    const project = await new Project(body);
    await project.save();
    return NextResponse.json(
      {
        success: true,
        project,
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

    const updatedProjectData = await Project.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );

    if (updatedProjectData) {
      return NextResponse.json(
        {
          success: true,
          behanceProject: updatedProjectData,
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

    const deletedProjectData = await Project.findByIdAndDelete(_id);

    if (deletedProjectData) {
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