import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRefreshToken, generateToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Environment } from "./types/enum";

export default async function middleware(req: NextRequest) {
  // Check if the request is for dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Get the access token and refresh token from cookies
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken) {
      // No token provided, redirect to login
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Basic token structure validation (Edge Runtime compatible)
    try {
      const parts = accessToken.split(".");
      if (parts.length !== 3) {
        const loginUrl = new URL("/login", req.nextUrl);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Decode and check expiration
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.userId || !payload.email) {
        const loginUrl = new URL("/login", req.nextUrl);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Token is expired, try to refresh it
        if (refreshToken) {
          try {
            const refreshResult = await tryRefreshTokenInMiddleware(
              refreshToken
            );
            if (refreshResult.success && refreshResult.newAccessToken) {
              // Create response with new tokens
              const response = NextResponse.next();
              response.cookies.set(
                "accessToken",
                refreshResult.newAccessToken,
                {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === Environment.PRODUCTION,
                  sameSite: "strict",
                  maxAge: 15 * 60, // 15 minutes
                  path: "/",
                }
              );

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
            console.error("Token refresh failed in middleware:", error);
          }
        }

        // Refresh failed or no refresh token, redirect to login
        const loginUrl = new URL("/login", req.nextUrl);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Token structure is valid, let server-side auth handle full verification
      return NextResponse.next();
    } catch (error) {
      // Token verification failed, redirect to login
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/**
 * Try to refresh the access token using refresh token (Edge Runtime compatible)
 */
async function tryRefreshTokenInMiddleware(refreshToken: string): Promise<{
  success: boolean;
  newAccessToken?: string;
  newRefreshToken?: string;
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
    };
  } catch (error) {
    console.error("Token refresh error in middleware:", error);
    return { success: false };
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
