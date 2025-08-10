import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'jobTitle', 'aboutDescription1', 'email', 'ownerEmail'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if user is creating portfolio for themselves
    if (body.ownerEmail !== user.email) {
      return NextResponse.json({ error: "You can only create portfolios for yourself" }, { status: 403 });
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
      }
    });

    return NextResponse.json({
      message: "Portfolio created successfully",
      portfolio: newPortfolio
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 