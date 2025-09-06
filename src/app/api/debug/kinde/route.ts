import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  // Security: Only allow in development or with proper authentication
  const isDevelopment = process.env.NODE_ENV === 'development';
  const debugKey = process.env.DEBUG_API_KEY;
  
  // Check if debug is enabled and properly secured
  if (!isDevelopment && !debugKey) {
    return NextResponse.json({
      error: 'Debug endpoint disabled in production',
      message: 'This endpoint is only available in development or with proper authentication'
    }, { status: 403 });
  }

  // Check for debug key in production
  if (!isDevelopment) {
    const requestHeaders = new Headers();
    const authHeader = requestHeaders.get('authorization');
    const providedKey = authHeader?.replace('Bearer ', '');
    
    if (providedKey !== debugKey) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid debug key required'
      }, { status: 401 });
    }
  }

  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();
    const authStatus = await isAuthenticated();

    // Sanitized response - no sensitive data
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      status: 'ok',
      kinde: {
        isAuthenticated: authStatus,
        user: user ? {
          id: user.id,
          email: user.email,
          given_name: user.given_name,
          family_name: user.family_name,
        } : null,
        // Only include full user object in development
        ...(isDevelopment && { userRaw: user })
      },
      config: {
        // Only show if variables are set, not their values
        clientId: process.env.KINDE_CLIENT_ID ? '✅ Set' : '❌ Missing',
        clientSecret: process.env.KINDE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
        issuerUrl: process.env.KINDE_ISSUER_URL ? '✅ Set' : '❌ Missing',
        siteUrl: process.env.KINDE_SITE_URL || '❌ Missing',
        redirectUrl: process.env.KINDE_REDIRECT_URL || '❌ Missing',
        logoutRedirectUrl: process.env.KINDE_LOGOUT_REDIRECT_URL || '❌ Missing',
      },
      urls: {
        current: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DEFAULT_APP_URL,
        expected: 'https://www.bikrant-malla.com.np',
      }
    });
  } catch (error) {
    // Log error to Sentry
    try {
      const { captureException } = require('@sentry/nextjs');
      captureException(error, {
        tags: {
          component: 'kinde-debug-api',
          environment: process.env.NODE_ENV
        },
        extra: {
          endpoint: '/api/debug/kinde',
          timestamp: new Date().toISOString()
        }
      });
    } catch (sentryError) {
      console.error('Sentry logging failed:', sentryError);
    }

    console.error('Kinde debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
