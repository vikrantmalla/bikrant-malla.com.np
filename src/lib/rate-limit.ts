import { NextRequest } from "next/server";
import { RateLimitError } from "./api-errors";

// Rate limit configurations for different endpoint types
export const RATE_LIMITS = {
  // Authentication endpoints (stricter limits)
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: "Too many authentication attempts, please try again later",
  },
  
  // Check role endpoint (more lenient for UI state management)
  CHECK_ROLE: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window
    message: "Too many role check requests, please try again later",
  },
  
  // General API endpoints
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "Too many requests, please try again later",
  },
  
  // File upload endpoints (more restrictive)
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: "Too many file uploads, please try again later",
  },
  
  // Admin endpoints (very strict)
  ADMIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window
    message: "Too many admin requests, please try again later",
  },
  
  // Public endpoints (more lenient)
  PUBLIC: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per window
    message: "Too many requests, please try again later",
  },
} as const;

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (request: NextRequest) => string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for different hosting providers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";
  
  // Include user agent for additional uniqueness
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  return `${ip}-${userAgent.slice(0, 50)}`;
}

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  const identifier = config.keyGenerator 
    ? config.keyGenerator(request)
    : getClientIdentifier(request);
  
  const now = Date.now();
  const key = `${identifier}-${config.windowMs}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      resetTime: now + config.windowMs,
    };
  }
  
  if (current.count >= config.max) {
    // Rate limit exceeded
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      resetTime: current.resetTime,
      retryAfter: Math.ceil((current.resetTime - now) / 1000),
    };
  }
  
  // Increment counter
  current.count++;
  
  return {
    success: true,
    limit: config.max,
    remaining: config.max - current.count,
    resetTime: current.resetTime,
  };
}

/**
 * Rate limit middleware that throws an error if limit is exceeded
 */
export function withRateLimit(config: RateLimitConfig) {
  return function (request: NextRequest) {
    const result = checkRateLimit(request, config);
    
    if (!result.success) {
      throw new RateLimitError(
        `${config.message}. Retry after ${result.retryAfter} seconds`
      );
    }
    
    return result;
  };
}

/**
 * Get rate limit info without throwing an error
 */
export function getRateLimitInfo(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  return checkRateLimit(request, config);
}

/**
 * Rate limit decorator for API routes
 */
export function rateLimit(config: RateLimitConfig) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      const result = checkRateLimit(request, config);
      
      if (!result.success) {
        throw new RateLimitError(
          `${config.message}. Retry after ${result.retryAfter} seconds`
        );
      }
      
      return originalMethod.apply(this, [request, ...args]);
    };
    
    return descriptor;
  };
}

/**
 * Predefined rate limiters for common use cases
 */
export const rateLimiters = {
  auth: withRateLimit(RATE_LIMITS.AUTH),
  checkRole: withRateLimit(RATE_LIMITS.CHECK_ROLE),
  api: withRateLimit(RATE_LIMITS.API),
  upload: withRateLimit(RATE_LIMITS.UPLOAD),
  admin: withRateLimit(RATE_LIMITS.ADMIN),
  public: withRateLimit(RATE_LIMITS.PUBLIC),
};

/**
 * Custom rate limiter for specific endpoints
 */
export function createRateLimiter(
  windowMs: number,
  max: number,
  message?: string
) {
  return withRateLimit({
    windowMs,
    max,
    message: message || `Too many requests, please try again later`,
  });
}
