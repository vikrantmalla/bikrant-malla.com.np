import { captureMessage, captureException, addBreadcrumb } from '@sentry/nextjs';

export interface KindeDebugInfo {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    given_name?: string;
    family_name?: string;
  } | null;
  config: {
    clientId: string;
    clientSecret: string;
    issuerUrl: string;
    siteUrl: string;
    redirectUrl: string;
    logoutRedirectUrl: string;
  };
  environment: string;
  timestamp: string;
}

export function logKindeConfiguration(config: Partial<KindeDebugInfo['config']>) {
  try {
    // Add breadcrumb for configuration tracking
    addBreadcrumb({
      message: 'Kinde Configuration Status',
      category: 'auth',
      level: 'info',
      data: {
        clientId: config.clientId ? 'Set' : 'Missing',
        clientSecret: config.clientSecret ? 'Set' : 'Missing',
        issuerUrl: config.issuerUrl ? 'Set' : 'Missing',
        siteUrl: config.siteUrl || 'Missing',
        redirectUrl: config.redirectUrl || 'Missing',
        logoutRedirectUrl: config.logoutRedirectUrl || 'Missing',
      }
    });

    // Log configuration status
    captureMessage('Kinde Configuration Check', {
      level: 'info',
      tags: {
        component: 'kinde-config',
        environment: process.env.NODE_ENV || 'unknown'
      },
      extra: {
        clientId: config.clientId ? '✅ Set' : '❌ Missing',
        clientSecret: config.clientSecret ? '✅ Set' : '❌ Missing',
        issuerUrl: config.issuerUrl || '❌ Missing',
        siteUrl: config.siteUrl || '❌ Missing',
        redirectUrl: config.redirectUrl || '❌ Missing',
        logoutRedirectUrl: config.logoutRedirectUrl || '❌ Missing',
      }
    });
  } catch (error) {
    console.error('Failed to log Kinde configuration to Sentry:', error);
  }
}

export function logKindeAuthentication(debugInfo: KindeDebugInfo) {
  try {
    // Add breadcrumb for authentication tracking
    addBreadcrumb({
      message: 'Kinde Authentication Status',
      category: 'auth',
      level: debugInfo.isAuthenticated ? 'info' : 'warning',
      data: {
        isAuthenticated: debugInfo.isAuthenticated,
        hasUser: !!debugInfo.user,
        userEmail: debugInfo.user?.email || 'N/A',
        environment: debugInfo.environment
      }
    });

    // Log authentication status
    captureMessage('Kinde Authentication Debug', {
      level: debugInfo.isAuthenticated ? 'info' : 'warning',
      tags: {
        component: 'kinde-auth',
        environment: debugInfo.environment,
        authenticated: debugInfo.isAuthenticated.toString()
      },
      extra: {
        isAuthenticated: debugInfo.isAuthenticated,
        user: debugInfo.user ? {
          id: debugInfo.user.id,
          email: debugInfo.user.email,
          name: `${debugInfo.user.given_name || ''} ${debugInfo.user.family_name || ''}`.trim()
        } : null,
        config: {
          clientId: debugInfo.config.clientId ? 'Set' : 'Missing',
          clientSecret: debugInfo.config.clientSecret ? 'Set' : 'Missing',
          issuerUrl: debugInfo.config.issuerUrl ? 'Set' : 'Missing',
          siteUrl: debugInfo.config.siteUrl || 'Missing',
          redirectUrl: debugInfo.config.redirectUrl || 'Missing',
          logoutRedirectUrl: debugInfo.config.logoutRedirectUrl || 'Missing',
        }
      }
    });
  } catch (error) {
    console.error('Failed to log Kinde authentication to Sentry:', error);
  }
}

export function logKindeError(error: Error, context: string) {
  try {
    captureException(error, {
      tags: {
        component: 'kinde-auth',
        context: context,
        environment: process.env.NODE_ENV || 'unknown'
      },
      extra: {
        context: context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'
      }
    });
  } catch (sentryError) {
    console.error('Failed to log Kinde error to Sentry:', sentryError);
    console.error('Original error:', error);
  }
}

export function logKindeBreadcrumb(message: string, data?: Record<string, any>) {
  try {
    addBreadcrumb({
      message: message,
      category: 'kinde-auth',
      level: 'info',
      data: data
    });
  } catch (error) {
    console.error('Failed to add Kinde breadcrumb to Sentry:', error);
  }
}
