import { Environment } from "@/types/enum";

// Resend Email Configuration based on environment
export const resendConfig = {
  // API Key - can be different for dev/prod
  apiKey:
    process.env.NODE_ENV === Environment.PRODUCTION
      ? process.env.RESEND_API_KEY_PROD
      : process.env.RESEND_API_KEY_DEV,

  // From Email - can be different for dev/prod
  fromEmail:
    process.env.NODE_ENV === Environment.PRODUCTION
      ? process.env.RESEND_FROM_EMAIL_PROD || "onboarding@resend.dev"
      : process.env.RESEND_FROM_EMAIL_DEV || "onboarding@resend.dev",

  // App URL for signup links - can be different for dev/prod
  appUrl:
    process.env.NODE_ENV === Environment.PRODUCTION
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.NEXT_PUBLIC_DEFAULT_APP_URL,
};

// Validation function to check if Resend is properly configured
export const validateResendConfig = () => {
  const issues = [];
  const isProduction = process.env.NODE_ENV === Environment.PRODUCTION;
  const envLabel = isProduction
    ? Environment.PRODUCTION
    : Environment.DEVELOPMENT;

  if (!resendConfig.apiKey) {
    issues.push(`Resend API key is not set for ${envLabel} environment`);
  }

  if (!resendConfig.fromEmail) {
    issues.push(`Resend from email is not set for ${envLabel} environment`);
  }

  if (!resendConfig.appUrl) {
    issues.push(`App URL is not set for ${envLabel} environment`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    environment: envLabel,
    config: {
      apiKey: resendConfig.apiKey
        ? "***" + resendConfig.apiKey.slice(-4)
        : undefined,
      fromEmail: resendConfig.fromEmail,
      appUrl: resendConfig.appUrl,
    },
  };
};
