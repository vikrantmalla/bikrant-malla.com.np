import { NextResponse } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request): Promise<Response> {
  const permissionCheck = await checkEditorPermissions(request);

  if (!permissionCheck.success) {
    // If permissionCheck.success is false, permissionCheck.response should contain an error response.
    // The lint error indicates that permissionCheck.response might be null, which is not a valid Response.
    // We must ensure a valid NextResponse is returned.
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      // This case implies the permission check failed but did not provide a specific error response.
      // Return a generic internal server error to ensure a valid Response is always returned.
      return NextResponse.json(
        { error: "Permission check failed unexpectedly." },
        { status: 500 }
      );
    }
  }

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "jobTitle",
      "aboutDescription1",
      "email",
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
    // Check if user is creating portfolio for themselves
    // Check if user is creating portfolio for themselves
    if (body.ownerEmail !== permissionCheck.user!.email) {
      return NextResponse.json(
        { error: "You can only create portfolios for yourself" },
        { status: 403 }
      );
    }

    const newPortfolio = await prisma.portfolio.create({
      data: {
        name: body.name,
        jobTitle: body.jobTitle,
        aboutDescription1: body.aboutDescription1,
        aboutDescription2: body.aboutDescription2,
        skills: body.skills || [],
        email: body.email,
        ownerEmail: body.ownerEmail,
        linkedIn: body.linkedIn,
        gitHub: body.gitHub,
        facebook: body.facebook,
        instagram: body.instagram,
      },
    });

    return NextResponse.json(
      {
        message: "Portfolio created successfully",
        portfolio: newPortfolio,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
