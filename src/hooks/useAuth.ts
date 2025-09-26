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
  
  // Cache for role data to prevent unnecessary API calls
  const [roleCache, setRoleCache] = useState<{
    data: UserRole | null;
    timestamp: number;
    userId: string | null;
  }>({ data: null, timestamp: 0, userId: null });
  
  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

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
      } else if (response.status === 401) {
        // Not authenticated, clear any local storage and redirect
        removeAccessToken();
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setPortfolioInfo(null);
        setRoleCache({ data: null, timestamp: 0, userId: null });
        router.push('/login');
      } else {
      // Other errors, clear any local storage
      removeAccessToken();
      setIsAuthenticated(false);
      setUser(null);
      setRoleCache({ data: null, timestamp: 0, userId: null });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeAccessToken();
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      setPortfolioInfo(null);
      setRoleCache({ data: null, timestamp: 0, userId: null });
      // Don't redirect on network errors during initial auth check
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Try to refresh token before redirecting
  const tryRefreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  // Check user role
  const checkUserRole = useCallback(async () => {
    if (!isAuthenticated || !user) return null;

    // Check cache first
    const now = Date.now();
    if (
      roleCache.data &&
      roleCache.userId === user.id &&
      (now - roleCache.timestamp) < CACHE_DURATION
    ) {
      return roleCache.data;
    }

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
        
        // Handle new API response structure with success/data wrapper
        const userData = data.data?.user || data.user;
        
        if (!userData) {
          console.error('Invalid response structure:', data);
          return null;
        }
        
        const roleData = {
          hasEditorRole: userData.hasEditorRole,
          isOwner: userData.isOwner
        };
        
        // Update cache
        setRoleCache({
          data: roleData,
          timestamp: now,
          userId: user.id
        });
        
        setUserRole(roleData);
        setPortfolioInfo(userData.portfolio);
        return roleData;
      } else if (response.status === 401) {
        // Token is invalid or expired, try to refresh first
        const refreshSuccess = await tryRefreshToken();
        
        if (refreshSuccess) {
          // Retry the request with new token
          const newToken = getAccessToken();
          const retryResponse = await fetch('/api/auth/check-role', {
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
          });

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            
            // Handle new API response structure with success/data wrapper
            const userData = data.data?.user || data.user;
            
            if (!userData) {
              console.error('Invalid response structure in retry:', data);
              return null;
            }
            
            const roleData = {
              hasEditorRole: userData.hasEditorRole,
              isOwner: userData.isOwner
            };
            
            // Update cache
            setRoleCache({
              data: roleData,
              timestamp: now,
              userId: user.id
            });
            
            setUserRole(roleData);
            setPortfolioInfo(userData.portfolio);
            return roleData;
          }
        }

        // Refresh failed or retry failed, redirect to login
        removeAccessToken();
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setPortfolioInfo(null);
        setRoleCache({ data: null, timestamp: 0, userId: null });
        router.push('/login');
        return null;
      } else if (response.status === 429) {
        // Rate limit exceeded - don't clear auth state, just return cached data if available
        console.warn('Rate limit exceeded for check-role, using cached data if available');
        if (roleCache.data && roleCache.userId === user.id) {
          return roleCache.data;
        }
        return null;
      } else {
        console.error('Error checking user role:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      // On network errors, also redirect to login to be safe
      removeAccessToken();
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      setPortfolioInfo(null);
      setRoleCache({ data: null, timestamp: 0, userId: null });
      router.push('/login');
      return null;
    } finally {
      setIsCheckingRole(false);
    }
  }, [isAuthenticated, user, tryRefreshToken, router, roleCache, CACHE_DURATION]);

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
      setRoleCache({ data: null, timestamp: 0, userId: null });
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