import { Environment } from "@/types/enum";

// Kinde Auth Configuration based on environment
export const kindeConfig = {
  // Issuer URL - can be different for dev/prod
  issuer: process.env.KINDE_ISSUER_URL,

  // Client ID - can be different for dev/prod
  clientId: process.env.KINDE_CLIENT_ID,

  // Client Secret - can be different for dev/prod
  clientSecret: process.env.KINDE_CLIENT_SECRET,

  // Redirect URLs - can be different for dev/prod
  redirectUrl:
    process.env.KINDE_REDIRECT_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DEFAULT_APP_URL}`,

  logoutRedirectUrl:
    process.env.KINDE_LOGOUT_REDIRECT_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DEFAULT_APP_URL,

  // Custom URLs
  customLoginUrl: "/login",

  // Default redirects
  defaultLoginRedirect: "/dashboard",
  defaultLogoutRedirect: "/",
};
console.log(kindeConfig);
console.log(process.env.KINDE_CLIENT_ID_DEV);
// Helper function to validate Kinde configuration
export const validateKindeConfig = () => {
  const issues = [];
  const isProduction = process.env.NODE_ENV === Environment.PRODUCTION;
  const envLabel = isProduction ? "production" : "development";

  if (!kindeConfig.issuer) {
    issues.push(`Kinde issuer URL is not set for ${envLabel} environment`);
  }

  if (!kindeConfig.clientId) {
    issues.push(`Kinde client ID is not set for ${envLabel} environment`);
  }

  if (!kindeConfig.clientSecret) {
    issues.push(`Kinde client secret is not set for ${envLabel} environment`);
  }

  if (!kindeConfig.redirectUrl) {
    issues.push(`Kinde redirect URL is not set for ${envLabel} environment`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    environment: envLabel,
    config: {
      issuer: kindeConfig.issuer,
      clientId: kindeConfig.clientId,
      redirectUrl: kindeConfig.redirectUrl,
      logoutRedirectUrl: kindeConfig.logoutRedirectUrl,
    },
  };
};

// Helper function to build login URL with redirect
export const buildLoginUrl = (redirectTo?: string) => {
  const baseUrl = `${kindeConfig.customLoginUrl}`;
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
