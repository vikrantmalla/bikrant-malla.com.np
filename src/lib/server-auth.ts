import { cookies } from "next/headers";
import { verifyToken, verifyRefreshToken, generateToken } from "./jwt";
import { prisma } from "./prisma";
import { AuthUser } from "./auth";

export interface ServerAuthResult {
  isAuthenticated: boolean;
  user: AuthUser | null;
  error?: string;
}

/**
 * Check authentication on the server side using cookies
 */
export async function getServerAuth(): Promise<ServerAuthResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken) {
      return {
        isAuthenticated: false,
        user: null,
        error: "No access token found",
      };
    }

    // Verify the access token
    let decoded = verifyToken(accessToken);

    // If access token is invalid or expired, try to refresh it
    if (!decoded || !decoded.userId) {
      if (!refreshToken) {
        return {
          isAuthenticated: false,
          user: null,
          error: "No refresh token found",
        };
      }

      // Try to refresh the token
      const refreshResult = await tryRefreshToken(refreshToken);
      if (!refreshResult.success) {
        return {
          isAuthenticated: false,
          user: null,
          error: "Token refresh failed",
        };
      }

      // Use the new access token
      decoded = verifyToken(refreshResult.newAccessToken!);
      if (!decoded || !decoded.userId) {
        return {
          isAuthenticated: false,
          user: null,
          error: "Invalid refreshed token",
        };
      }
    }

    // Get user data from database
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

    if (!user) {
      return {
        isAuthenticated: false,
        user: null,
        error: "User not found",
      };
    }

    if (!user.isActive) {
      return {
        isAuthenticated: false,
        user: null,
        error: "Account is disabled",
      };
    }

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
      },
    };
  } catch (error) {
    console.error("Server auth error:", error);
    return {
      isAuthenticated: false,
      user: null,
      error: "Authentication failed",
    };
  }
}

/**
 * Try to refresh the access token using refresh token
 */
async function tryRefreshToken(
  refreshToken: string
): Promise<{
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
    console.error("Token refresh error:", error);
    return { success: false };
  }
}

/**
 * Check if user has specific role
 */
export async function checkServerRole(
  requiredRole: "OWNER" | "EDITOR"
): Promise<boolean> {
  try {
    const authResult = await getServerAuth();
    if (!authResult.isAuthenticated || !authResult.user) {
      return false;
    }

    // Check if user has the required role
    // This would need to be implemented based on your role checking logic
    return true; // Placeholder - implement based on your role system
  } catch (error) {
    console.error("Server role check error:", error);
    return false;
  }
}
