"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { clientApi } from "@/service/apiService";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  emailVerified: boolean;
}

interface UserRole {
  hasEditorRole: boolean;
  isOwner: boolean;
}

interface PortfolioInfo {
  id: string;
  name: string;
  ownerEmail: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [portfolioInfo, setPortfolioInfo] = useState<PortfolioInfo | null>(null);

  // Get access token from localStorage
  const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  };

  // Set access token in localStorage
  const setAccessToken = (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  };

  // Remove access token from localStorage
  const removeAccessToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  };

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      // Use the /api/auth/me endpoint which will check server-side cookies
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        // Not authenticated, clear any local storage
        removeAccessToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeAccessToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check user role
  const checkUserRole = useCallback(async () => {
    if (!isAuthenticated || !user) return null;

    setIsCheckingRole(true);
    try {
      const token = getAccessToken();
      const response = await fetch('/api/auth/check-role', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const roleData = {
          hasEditorRole: data.user.hasEditorRole,
          isOwner: data.user.isOwner
        };
        setUserRole(roleData);
        setPortfolioInfo(data.user.portfolio);
        return roleData;
      }
      return null;
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    } finally {
      setIsCheckingRole(false);
    }
  }, [isAuthenticated, user]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        // Don't set authentication state immediately - let checkAuth handle it
        // This ensures server-side cookies are properly set
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      removeAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setPortfolioInfo(null);
      router.push('/');
    }
  };

  // Redirect to login with optional redirect parameter
  const redirectToLogin = (redirectTo?: string) => {
    const redirectUrl = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';
    router.push(redirectUrl);
  };

  // Check if user has access to a specific route
  const hasAccess = (requireEditor = false, requireOwner = false) => {
    if (!isAuthenticated || !userRole) return false;
    
    if (requireOwner) return userRole.isOwner;
    if (requireEditor) return userRole.hasEditorRole || userRole.isOwner;
    
    return true;
  };

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Check user role when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      checkUserRole();
    }
  }, [isAuthenticated, user, checkUserRole]);

  return {
    user,
    isAuthenticated,
    isLoading,
    userRole,
    isCheckingRole,
    checkUserRole,
    login,
    logout,
    redirectToLogin,
    hasAccess,
    portfolioInfo
  };
}; 