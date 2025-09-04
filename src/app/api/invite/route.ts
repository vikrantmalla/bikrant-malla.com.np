import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import InvitationEmail from "@/components/emails/InvitationEmail";
import { resendConfig } from "@/lib/resend-config";
import { Role } from "@/types/enum";

const resend = new Resend(resendConfig.apiKey);

export async function POST(req: Request): Promise<Response> {
  const permissionCheck = await checkEditorPermissions();

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

  const user = permissionCheck.kindeUser;

  if (!user || !user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, role" },
        { status: 400 }
      );
    }

    if (role !== Role.EDITOR && role !== Role.VIEWER) {
      return NextResponse.json(
        { error: `Invalid role. Must be "${Role.EDITOR}" or "${Role.VIEWER}"` },
        { status: 400 }
      );
    }
    const portfolio = await prisma.portfolio.findFirst({
      where: { ownerEmail: user!.email },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (portfolio.ownerEmail !== user!.email) {
      return NextResponse.json(
        { error: "Forbidden: Only the portfolio owner can invite users" },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let dbUser;
    if (existingUser) {
      dbUser = existingUser;
    } else {
      // Create a placeholder user record for the invited user
      dbUser = await prisma.user.create({
        data: {
          email,
          name: "Invited User",
          kindeUserId: crypto.randomUUID(), // Assign a temporary unique ID as kindeUserId is required
        },
      });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.userPortfolioRole.findFirst({
      where: {
        userId: dbUser.id,
        portfolioId: portfolio.id,
      },
    });

    if (existingInvitation) {
      // Update existing invitation
      await prisma.userPortfolioRole.update({
        where: { id: existingInvitation.id },
        data: {
          role,
          invitedAt: new Date(),
        },
      });
    } else {
      // Create new invitation
      await prisma.userPortfolioRole.create({
        data: {
          userId: dbUser.id,
          portfolioId: portfolio.id,
          role,
          invitedAt: new Date(),
        },
      });
    }

    // Send email notification to the invited user using Resend
    const signupUrl = `${resendConfig.appUrl}/login`;

    try {
      const emailResult = await resend.emails.send({
        from: resendConfig.fromEmail,
        to: email,
        subject: `You have been invited to collaborate on ${portfolio.name}`,
        react: InvitationEmail({
          inviterName: user.given_name || user.email,
          portfolioName: portfolio.name,
          role,
          signupUrl,
        }),
      });

      return NextResponse.json(
        {
          message: `Invitation sent to ${email} with role ${role}`,
          note: "The user will need to sign up through the regular Kinde flow to access the portfolio",
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("❌ Failed to send invitation email:", emailError);
      console.error("Email error details:", {
        message:
          emailError instanceof Error ? emailError.message : "Unknown error",
        stack: emailError instanceof Error ? emailError.stack : undefined,
      });

      // Check for specific domain verification error
      const errorMessage =
        emailError instanceof Error ? emailError.message : "";
      if (errorMessage.includes("domain is not verified")) {
        return NextResponse.json(
          {
            error: "Email domain not verified",
            details:
              "The sending email domain is not verified in Resend. Please use a verified domain or contact support.",
            solution:
              "Update RESEND_FROM_EMAIL to use a verified domain (e.g., onboarding@resend.dev for testing)",
            debug: {
              hasApiKey: !!resendConfig.apiKey,
              fromEmail: resendConfig.fromEmail,
            },
          },
          { status: 400 }
        );
      }

      // Return error response with details for debugging
      return NextResponse.json(
        {
          error: "Failed to send email",
          details:
            emailError instanceof Error ? emailError.message : "Unknown error",
          debug: {
            hasApiKey: !!resendConfig.apiKey,
            fromEmail: resendConfig.fromEmail,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Invite user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
