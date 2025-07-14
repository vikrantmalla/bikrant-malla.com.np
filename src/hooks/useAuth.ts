"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { sanitizeRedirectUrl } from "@/lib/kinde-config";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();
  const [userRole, setUserRole] = useState<{ hasEditorRole: boolean; isOwner: boolean } | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  // Check user role
  const checkUserRole = useCallback(async () => {
    if (!isAuthenticated || !user) return null;

    setIsCheckingRole(true);
    try {
      const response = await fetch("/api/auth/check-role");
      if (response.ok) {
        const data = await response.json();
        const roleData = {
          hasEditorRole: data.user.hasEditorRole,
          isOwner: data.user.isOwner
        };
        setUserRole(roleData);
        return roleData;
      } else if (response.status === 404) {
        // User not found in database - try to create them
        const createResponse = await fetch("/api/auth/create-user", {
          method: "POST",
        });
        if (createResponse.ok) {
          // Retry the role check
          const retryResponse = await fetch("/api/auth/check-role");
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            const roleData = {
              hasEditorRole: data.user.hasEditorRole,
              isOwner: data.user.isOwner
            };
            setUserRole(roleData);
            return roleData;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    } finally {
      setIsCheckingRole(false);
    }
  }, [isAuthenticated, user]);

  // Redirect to login with optional redirect parameter
  const redirectToLogin = (redirectTo?: string) => {
    const sanitizedRedirect = redirectTo ? sanitizeRedirectUrl(redirectTo) : "/dashboard";
    router.push(`/login?redirect=${encodeURIComponent(sanitizedRedirect)}`);
  };

  // Check if user has access to a specific route
  const hasAccess = (requireEditor = false, requireOwner = false) => {
    if (!isAuthenticated || !userRole) return false;
    
    if (requireOwner) return userRole.isOwner;
    if (requireEditor) return userRole.hasEditorRole || userRole.isOwner;
    
    return true;
  };

  // Logout and redirect
  const logout = () => {
    // The LogoutLink component will handle the actual logout
    // This is just a utility function for programmatic logout
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    userRole,
    isCheckingRole,
    checkUserRole,
    redirectToLogin,
    hasAccess,
    logout
  };
}; 