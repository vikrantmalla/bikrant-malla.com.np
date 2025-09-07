import { NextResponse, NextRequest } from "next/server";
import { checkSecureEditorPermissions } from "@/lib/secure-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const permissionCheck = await checkSecureEditorPermissions(request);

  if (!permissionCheck.success) {
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      return NextResponse.json(
        { error: "Permission check failed unexpectedly." },
        { status: 500 }
      );
    }
  }

  if (!permissionCheck.user || !permissionCheck.user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "jobTitle",
      "aboutDescription1",
      "ownerEmail",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: id },
      data: {
        name: body.name,
        jobTitle: body.jobTitle,
        aboutDescription1: body.aboutDescription1,
        aboutDescription2: body.aboutDescription2,
        skills: body.skills || [],
        ownerEmail: body.ownerEmail,
        linkedIn: body.linkedIn,
        gitHub: body.gitHub,
        facebook: body.facebook,
        instagram: body.instagram,
      },
    });

    return NextResponse.json({
      message: "Portfolio updated successfully",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
