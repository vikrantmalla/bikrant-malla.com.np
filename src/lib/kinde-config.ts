// Kinde Auth Configuration
export const kindeConfig = {
  // These should be set in your environment variables
  issuer: process.env.KINDE_ISSUER_URL || process.env.KINDE_ISSUER,
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectUrl: process.env.KINDE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/callback`,
  logoutRedirectUrl: process.env.KINDE_LOGOUT_REDIRECT_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  
  // Custom URLs
  customLoginUrl: "/login",
  customCallbackUrl: "/callback",
  
  // Default redirects
  defaultLoginRedirect: "/dashboard",
  defaultLogoutRedirect: "/",
};

// Helper function to build login URL with redirect
export const buildLoginUrl = (redirectTo?: string) => {
  const baseUrl = `${kindeConfig.customLoginUrl}`;
  if (redirectTo) {
    return `${baseUrl}?redirect=${encodeURIComponent(redirectTo)}`;
  }
  return baseUrl;
};

// Helper function to build callback URL with redirect
export const buildCallbackUrl = (redirectTo?: string) => {
  const baseUrl = `${kindeConfig.customCallbackUrl}`;
  if (redirectTo) {
    return `${baseUrl}?redirect=${encodeURIComponent(redirectTo)}`;
  }
  return baseUrl;
};

// Helper function to validate redirect URLs (prevent open redirects)
export const isValidRedirectUrl = (url: string): boolean => {
  try {
    const redirectUrl = new URL(url, window.location.origin);
    return redirectUrl.origin === window.location.origin;
  } catch {
    return false;
  }
};

// Helper function to sanitize redirect URL
export const sanitizeRedirectUrl = (url: string): string => {
  if (!isValidRedirectUrl(url)) {
    return kindeConfig.defaultLoginRedirect;
  }
  return url;
}; 