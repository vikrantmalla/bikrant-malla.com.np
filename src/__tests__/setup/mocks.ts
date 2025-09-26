// Mock setup for API tests
import { jest } from "@jest/globals";

// Mock Prisma client
export const mockPrisma = {
  $connect: jest.fn() as jest.MockedFunction<any>,
  $disconnect: jest.fn() as jest.MockedFunction<any>,
  $runCommandRaw: jest.fn() as jest.MockedFunction<any>,
  user: {
    create: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  portfolio: {
    create: jest.fn() as jest.MockedFunction<any>,
    findFirst: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  project: {
    create: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  archiveProject: {
    create: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  config: {
    create: jest.fn() as jest.MockedFunction<any>,
    findFirst: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  userPortfolioRole: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    findFirst: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  techTag: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  techOption: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  projectTag: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  archiveProjectTag: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
};

// Mock custom authentication
export const mockCustomAuth = {
  getUserFromToken: jest.fn() as jest.MockedFunction<any>,
  getUserFromCookie: jest.fn() as jest.MockedFunction<any>,
  checkUserPermissions: jest.fn() as jest.MockedFunction<any>,
  generateAuthTokens: jest.fn() as jest.MockedFunction<any>,
  verifyToken: jest.fn() as jest.MockedFunction<any>,
};

// Mock Next.js modules
export const mockNextJS = {
  NextRequest: jest.fn() as jest.MockedFunction<any>,
  NextResponse: {
    json: jest.fn().mockImplementation((data: any, options: any = {}) => ({
      json: () => Promise.resolve(data),
      status: options.status || 200,
    })) as jest.MockedFunction<any>,
  },
};

// Setup all mocks
export function setupMocks() {
  // Mock Prisma
  jest.mock("@/lib/prisma", () => ({
    prisma: mockPrisma,
  }));

  // Mock custom authentication
  jest.mock("@/lib/auth", () => ({
    getUserFromToken: mockCustomAuth.getUserFromToken,
    getUserFromCookie: mockCustomAuth.getUserFromCookie,
    checkUserPermissions: mockCustomAuth.checkUserPermissions,
    generateAuthTokens: mockCustomAuth.generateAuthTokens,
    isValidEmail: jest.fn().mockReturnValue(true),
  }));

  // Mock JWT utilities
  jest.mock("@/lib/jwt", () => ({
    verifyToken: jest
      .fn()
      .mockReturnValue({ userId: "mock-user-id", email: "mock@example.com" }),
    verifyRefreshToken: jest
      .fn()
      .mockReturnValue({ userId: "mock-user-id", email: "mock@example.com" }),
    generateToken: jest.fn().mockReturnValue("mock-token"),
  }));

  // Mock Next.js
  jest.mock("next/server", () => mockNextJS);

  // Mock role utilities
  jest.mock("@/lib/roleUtils", () => ({
    checkEditorPermissions: jest.fn() as jest.MockedFunction<any>,
    checkPortfolioAccess: jest.fn() as jest.MockedFunction<any>,
    checkEditorRole: jest.fn() as jest.MockedFunction<any>,
    checkOwnerRole: jest.fn() as jest.MockedFunction<any>,
  }));

  // Mock API utilities (rate limiting and error handling)
  jest.mock("@/lib/api-utils", () => ({
    withAuthRateLimit: jest
      .fn()
      .mockImplementation((handler: any) => async (...args: any[]) => {
        try {
          return await handler(...args);
        } catch (error: any) {
          return {
            json: () =>
              Promise.resolve({
                success: false,
                error: error.message || "Internal server error",
                code: "INTERNAL_ERROR",
              }),
            status: 500,
          };
        }
      }),
    withApiErrorHandler: jest
      .fn()
      .mockImplementation((handler: any) => async (...args: any[]) => {
        try {
          return await handler(...args);
        } catch (error: any) {
          return {
            json: () =>
              Promise.resolve({
                success: false,
                error: error.message || "Internal server error",
                code: "INTERNAL_ERROR",
              }),
            status: 500,
          };
        }
      }),
    withApiRateLimit: jest
      .fn()
      .mockImplementation((handler: any) => async (...args: any[]) => {
        try {
          return await handler(...args);
        } catch (error: any) {
          return {
            json: () =>
              Promise.resolve({
                success: false,
                error: error.message || "Internal server error",
                code: "INTERNAL_ERROR",
              }),
            status: 500,
          };
        }
      }),
    withUploadRateLimit: jest
      .fn()
      .mockImplementation((handler: any) => async (...args: any[]) => {
        try {
          return await handler(...args);
        } catch (error: any) {
          return {
            json: () =>
              Promise.resolve({
                success: false,
                error: error.message || "Internal server error",
                code: "INTERNAL_ERROR",
              }),
            status: 500,
          };
        }
      }),
    withAdminRateLimit: jest
      .fn()
      .mockImplementation((handler: any) => async (...args: any[]) => {
        try {
          return await handler(...args);
        } catch (error: any) {
          return {
            json: () =>
              Promise.resolve({
                success: false,
                error: error.message || "Internal server error",
                code: "INTERNAL_ERROR",
              }),
            status: 500,
          };
        }
      }),
    withPublicRateLimit: jest
      .fn()
      .mockImplementation((handler: any) => async (...args: any[]) => {
        try {
          return await handler(...args);
        } catch (error: any) {
          return {
            json: () =>
              Promise.resolve({
                success: false,
                error: error.message || "Internal server error",
                code: "INTERNAL_ERROR",
              }),
            status: 500,
          };
        }
      }),
    validateRequestMiddleware: jest.fn(),
    addSecurityHeaders: jest.fn().mockImplementation((response) => response),
    addCorsHeaders: jest.fn().mockImplementation((response) => response),
    handleCorsPreflight: jest.fn().mockReturnValue({ status: 200 }),
    checkRateLimit: jest.fn().mockReturnValue(true),
    logRequest: jest.fn(),
    config: {
      isProduction: false,
      isDevelopment: true,
      nodeEnv: "test",
    },
  }));

  // Mock API errors
  jest.mock("@/lib/api-errors", () => ({
    createSuccessResponse: jest.fn().mockImplementation((data, message) => ({
      json: () =>
        Promise.resolve({
          success: true,
          data,
          message,
        }),
      status: 200,
      cookies: {
        set: jest.fn(),
      },
    })),
    handleApiError: jest.fn().mockImplementation((error: any) => ({
      json: () =>
        Promise.resolve({
          success: false,
          error: error.message || "Internal server error",
          code: "INTERNAL_ERROR",
        }),
      status: 500,
    })),
    ApiError: class ApiError extends Error {
      statusCode: number;
      code?: string;
      details?: any;

      constructor(
        message: string,
        statusCode = 500,
        code?: string,
        details?: any
      ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
      }
    },
    ValidationError: class ValidationError extends Error {
      constructor(message: string, details?: any) {
        super(message);
        this.name = "ValidationError";
      }
    },
    AuthenticationError: class AuthenticationError extends Error {
      constructor(message = "Authentication required") {
        super(message);
        this.name = "AuthenticationError";
      }
    },
    AuthorizationError: class AuthorizationError extends Error {
      constructor(message = "Insufficient permissions") {
        super(message);
        this.name = "AuthorizationError";
      }
    },
    NotFoundError: class NotFoundError extends Error {
      constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
      }
    },
    ConflictError: class ConflictError extends Error {
      constructor(message = "Resource already exists") {
        super(message);
        this.name = "ConflictError";
      }
    },
    RequestTooLargeError: class RequestTooLargeError extends Error {
      constructor(message = "Request too large") {
        super(message);
        this.name = "RequestTooLargeError";
      }
    },
    RateLimitError: class RateLimitError extends Error {
      constructor(message = "Too many requests") {
        super(message);
        this.name = "RateLimitError";
      }
    },
  }));

  // Mock rate limiting
  jest.mock("@/lib/rate-limit", () => ({
    rateLimiters: {
      auth: jest.fn(),
      checkRole: jest.fn(),
      api: jest.fn(),
      upload: jest.fn(),
      admin: jest.fn(),
      public: jest.fn(),
    },
    RATE_LIMITS: {
      AUTH: { windowMs: 900000, max: 5, message: "Too many auth attempts" },
      CHECK_ROLE: {
        windowMs: 900000,
        max: 50,
        message: "Too many role checks",
      },
      API: { windowMs: 900000, max: 100, message: "Too many requests" },
      UPLOAD: { windowMs: 3600000, max: 10, message: "Too many uploads" },
      ADMIN: { windowMs: 900000, max: 20, message: "Too many admin requests" },
      PUBLIC: { windowMs: 900000, max: 200, message: "Too many requests" },
    },
    checkRateLimit: jest.fn().mockReturnValue({ success: true }),
    withRateLimit: jest
      .fn()
      .mockImplementation((config: any) => (request: any) => ({
        success: true,
      })),
    getRateLimitInfo: jest.fn().mockReturnValue({ success: true }),
    rateLimit: jest
      .fn()
      .mockImplementation(
        (config: any) => (target: any, propertyKey: any, descriptor: any) =>
          descriptor
      ),
    createRateLimiter: jest
      .fn()
      .mockImplementation(
        (windowMs: any, max: any, message: any) => (request: any) => ({
          success: true,
        })
      ),
  }));

  // Mock validation
  jest.mock("@/lib/validation", () => ({
    validateRequest: jest
      .fn()
      .mockImplementation((schema, data) => ({ success: true, data })),
    validateRequestSize: jest.fn().mockReturnValue(true),
    emailSchema: { parse: jest.fn().mockReturnValue("test@example.com") },
    passwordSchema: { parse: jest.fn().mockReturnValue("password123") },
    uuidSchema: {
      parse: jest.fn().mockReturnValue("123e4567-e89b-12d3-a456-426614174000"),
    },
    loginSchema: {
      parse: jest
        .fn()
        .mockReturnValue({
          email: "test@example.com",
          password: "password123",
        }),
    },
    registerSchema: {
      parse: jest
        .fn()
        .mockReturnValue({
          email: "test@example.com",
          password: "password123",
          name: "Test User",
        }),
    },
    resetPasswordSchema: {
      parse: jest
        .fn()
        .mockReturnValue({
          email: "test@example.com",
          password: "password123",
        }),
    },
    createProjectSchema: { parse: jest.fn().mockReturnValue({}) },
    updateProjectSchema: { parse: jest.fn().mockReturnValue({}) },
    createPortfolioSchema: { parse: jest.fn().mockReturnValue({}) },
    updatePortfolioSchema: { parse: jest.fn().mockReturnValue({}) },
    createTechTagSchema: { parse: jest.fn().mockReturnValue({}) },
    bulkCreateTechTagsSchema: { parse: jest.fn().mockReturnValue({}) },
    createTechOptionSchema: { parse: jest.fn().mockReturnValue({}) },
    inviteUserSchema: { parse: jest.fn().mockReturnValue({}) },
    updateConfigSchema: { parse: jest.fn().mockReturnValue({}) },
    createArchiveProjectSchema: { parse: jest.fn().mockReturnValue({}) },
    updateArchiveProjectSchema: { parse: jest.fn().mockReturnValue({}) },
  }));
}

// Reset all mocks
export function resetMocks() {
  Object.values(mockPrisma).forEach((model: any) => {
    if (model && typeof model === "object") {
      Object.values(model).forEach((method: any) => {
        if (jest.isMockFunction(method)) {
          method.mockReset();
        }
      });
    }
  });

  Object.values(mockCustomAuth).forEach((method: any) => {
    if (jest.isMockFunction(method)) {
      method.mockReset();
    }
  });

  Object.values(mockNextJS).forEach((method: any) => {
    if (jest.isMockFunction(method)) {
      method.mockReset();
    }
  });
}
