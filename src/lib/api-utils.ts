import { NextRequest, NextResponse } from "next/server";
import { validateRequestSize } from "./validation";
import { RequestTooLargeError, handleApiError } from "./api-errors";
import { rateLimiters, RATE_LIMITS } from "./rate-limit";

// Request size limits
export const REQUEST_LIMITS = {
  JSON: 1024 * 1024, // 1MB
  FORM_DATA: 10 * 1024 * 1024, // 10MB
  TEXT: 1024 * 1024, // 1MB
} as const;

// Security headers
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

// CORS headers
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL || "https://bikrant-malla.com.np"
      : "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

// Request validation middleware
export function validateRequestMiddleware(request: NextRequest) {
  // Check request size
  if (!validateRequestSize(request, REQUEST_LIMITS.JSON)) {
    throw new RequestTooLargeError("Request body too large");
  }

  // Check content type for POST/PUT requests
  const method = request.method;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Content-Type must be application/json");
    }
  }
}

// Add security headers to response
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Add CORS headers to response
export function addCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Handle OPTIONS requests for CORS
export function handleCorsPreflight(): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

// Rate limiting (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}

// API route wrapper with error handling and rate limiting
export function withApiErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  rateLimitType: keyof typeof rateLimiters = 'api'
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      // Apply rate limiting
      const request = args[0] as NextRequest;
      rateLimiters[rateLimitType](request);
      
      const response = await handler(...args);
      return addSecurityHeaders(response);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Specialized wrappers for different endpoint types
export const withAuthRateLimit = <T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) => withApiErrorHandler(handler, 'auth');

export const withApiRateLimit = <T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) => withApiErrorHandler(handler, 'api');

export const withUploadRateLimit = <T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) => withApiErrorHandler(handler, 'upload');

export const withAdminRateLimit = <T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) => withApiErrorHandler(handler, 'admin');

export const withPublicRateLimit = <T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) => withApiErrorHandler(handler, 'public');

// Request logging
export function logRequest(request: NextRequest, response: NextResponse) {
  const { method, url } = request;
  const { status } = response;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url} - ${status}`);
}

// Environment configuration
export const config = {
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
