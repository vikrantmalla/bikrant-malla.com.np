import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import { verifyToken, verifyRefreshToken, generateToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Environment } from "@/types/enum";
import { withApiErrorHandler } from "@/lib/api-utils";
import { createSuccessResponse } from "@/lib/api-errors";

async function meHandler(request: NextRequest) {
  // Get user from cookie
  let authResult = await getUserFromCookie(request);

  // If authentication failed due to expired token, try to refresh
  if (!authResult.user && authResult.error === "Invalid token") {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      try {
        const refreshResult = await tryRefreshToken(refreshToken);
        if (refreshResult.success && refreshResult.newAccessToken) {
          // Set new access token in response
          const response = createSuccessResponse({
            user: {
              id: refreshResult.user!.id,
              email: refreshResult.user!.email,
              name: refreshResult.user!.name,
              isActive: refreshResult.user!.isActive,
              emailVerified: refreshResult.user!.emailVerified,
            },
          });

          response.cookies.set("accessToken", refreshResult.newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === Environment.PRODUCTION,
            sameSite: "strict",
            maxAge: 15 * 60, // 15 minutes
            path: "/",
          });

          if (refreshResult.newRefreshToken) {
            response.cookies.set(
              "refreshToken",
              refreshResult.newRefreshToken,
              {
                httpOnly: true,
                secure: process.env.NODE_ENV === Environment.PRODUCTION,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: "/",
              }
            );
          }

          return response;
        }
      } catch (error) {
        console.error("Token refresh failed in /api/auth/me:", error);
      }
    }
  }

  if (!authResult.user) {
    return NextResponse.json(
      { error: authResult.error || "Unauthorized" },
      { status: 401 }
    );
  }

  return createSuccessResponse({
    user: {
      id: authResult.user.id,
      email: authResult.user.email,
      name: authResult.user.name,
      isActive: authResult.user.isActive,
      emailVerified: authResult.user.emailVerified,
    },
  });
}

// Apply rate limiting and error handling
export const GET = withApiErrorHandler(meHandler, 'checkRole');

/**
 * Try to refresh the access token using refresh token
 */
async function tryRefreshToken(
  refreshToken: string
): Promise<{
  success: boolean;
  newAccessToken?: string;
  newRefreshToken?: string;
  user?: any;
}> {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.userId) {
      return { success: false };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user || !user.isActive) {
      return { success: false };
    }

    // Generate new tokens
    const newAccessToken = generateToken(
      { userId: user.id, email: user.email },
      { expiresIn: "15m" }
    );

    const newRefreshToken = generateToken(
      { userId: user.id, email: user.email, type: "refresh" },
      { expiresIn: "7d" }
    );

    return {
      success: true,
      newAccessToken,
      newRefreshToken,
      user,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return { success: false };
  }
}
