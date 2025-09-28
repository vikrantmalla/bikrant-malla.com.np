import { NextRequest } from "next/server";
import { checkEditorPermissions } from "@/lib/roleUtils";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { withAdminRateLimit } from "@/lib/api-utils";
import {
  createSuccessResponse,
  NotFoundError,
  AuthorizationError,
  ConflictError,
} from "@/lib/api-errors";
import { validateRequest, inviteUserSchema } from "@/lib/validation";
import { Resend } from "resend";
import InvitationEmail from "@/components/emails/InvitationEmail";
import { resendConfig } from "@/lib/resend-config";
import { Role } from "@/types/enum";

// POST invite user
export const POST = withAdminRateLimit(async (request: NextRequest) => {
  const permissionCheck = await checkEditorPermissions(request);

  if (!permissionCheck.success) {
    if (permissionCheck.response) {
      return permissionCheck.response;
    } else {
      throw new Error("Permission check failed unexpectedly");
    }
  }

  if (!permissionCheck.user || !permissionCheck.user.email) {
    throw new NotFoundError("User not found");
  }

  const body = await request.json();
  const validation = validateRequest(inviteUserSchema, body);

  if (!validation.success) {
    throw validation.errors;
  }

  const { email, role } = validation.data;

  const portfolio = await prisma.portfolio.findFirst({
    where: { ownerEmail: permissionCheck.user.email },
  });

  if (!portfolio) {
    throw new NotFoundError("Portfolio not found");
  }

  if (portfolio.ownerEmail !== permissionCheck.user.email) {
    throw new AuthorizationError("Only the portfolio owner can invite users");
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
    // Generate a temporary password that the user will need to reset
    const tempPassword = crypto.randomUUID();
    const hashedPassword = await hashPassword(tempPassword);
    
    dbUser = await prisma.user.create({
      data: {
        email,
        name: "Invited User",
        password: hashedPassword,
        isActive: true,
        emailVerified: false, // User needs to verify email and set their own password
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

  // Check if Resend is properly configured
  if (!resendConfig.apiKey) {
    // In test environment or when Resend is not configured, skip email sending
    return createSuccessResponse(
      {
        message: `Invitation created for ${email} with role ${role}`,
        note: "The user will need to sign up through the regular Kinde flow to access the portfolio",
        emailSent: false,
      },
      "Invitation created successfully"
    );
  }

  try {
    // Initialize Resend with API key at runtime
    const resend = new Resend(resendConfig.apiKey);
    await resend.emails.send({
      from: resendConfig.fromEmail,
      to: email,
      subject: `You have been invited to collaborate on ${portfolio.name}`,
      react: InvitationEmail({
        inviterName: permissionCheck.user.email,
        portfolioName: portfolio.name,
        role,
        signupUrl,
      }),
    });

    return createSuccessResponse(
      {
        message: `Invitation sent to ${email} with role ${role}`,
        note: "The user will need to sign up through the regular Kinde flow to access the portfolio",
        emailSent: true,
      },
      "Invitation sent successfully"
    );
  } catch (emailError) {
    console.error("❌ Failed to send invitation email:", emailError);
    
    // Check for specific domain verification error
    const errorMessage = emailError instanceof Error ? emailError.message : "";
    if (errorMessage.includes("domain is not verified")) {
      throw new ConflictError(
        "Email domain not verified. Please use a verified domain or contact support."
      );
    }

    throw new Error(`Failed to send email: ${errorMessage}`);
  }
});
