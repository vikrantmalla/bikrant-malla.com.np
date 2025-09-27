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
    findFirst: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  techOption: {
    create: jest.fn() as jest.MockedFunction<any>,
    findFirst: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    findUnique: jest.fn() as jest.MockedFunction<any>,
    update: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  projectTag: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    findFirst: jest.fn() as jest.MockedFunction<any>,
    delete: jest.fn() as jest.MockedFunction<any>,
    deleteMany: jest.fn() as jest.MockedFunction<any>,
  },
  archiveProjectTag: {
    create: jest.fn() as jest.MockedFunction<any>,
    findMany: jest.fn() as jest.MockedFunction<any>,
    findFirst: jest.fn() as jest.MockedFunction<any>,
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
    checkProjectAccess: jest.fn() as jest.MockedFunction<any>,
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
          // Handle custom error classes
          if (error && typeof error === "object" && "statusCode" in error) {
            return {
              json: () =>
                Promise.resolve({
                  success: false,
                  error: error.message,
                  code: error.code,
                  details: error.details,
                }),
              status: error.statusCode,
            };
          }
          // Handle validation errors (ZodError or validation-related errors)
          if (
            error &&
            error.message &&
            (error.name === "ZodError" ||
              error.message.includes("required") ||
              error.message.includes("Invalid"))
          ) {
            return {
              json: () =>
                Promise.resolve({
                  success: false,
                  error: error.message,
                  code: "VALIDATION_ERROR",
                }),
              status: 400,
            };
          }
          // Generic error
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
          // Use the mock error handler logic
          if (error && typeof error === "object" && "statusCode" in error) {
            return {
              json: () =>
                Promise.resolve({
                  success: false,
                  error: error.message,
                  code: error.code,
                  details: error.details,
                }),
              status: error.statusCode,
            };
          }
          // Handle validation errors (ZodError or validation-related errors)
          if (
            error &&
            error.message &&
            (error.name === "ZodError" ||
              error.message.includes("required") ||
              error.message.includes("Invalid"))
          ) {
            return {
              json: () =>
                Promise.resolve({
                  success: false,
                  error: error.message,
                  code: "VALIDATION_ERROR",
                }),
              status: 400,
            };
          }
          // Generic error
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
          // Use the mock error handler logic
          if (error && typeof error === "object" && "statusCode" in error) {
            return {
              json: () =>
                Promise.resolve({
                  success: false,
                  error: error.message,
                  code: error.code,
                  details: error.details,
                }),
              status: error.statusCode,
            };
          }
          // Handle validation errors (ZodError or validation-related errors)
          if (
            error &&
            error.message &&
            (error.name === "ZodError" ||
              error.message.includes("required") ||
              error.message.includes("Invalid"))
          ) {
            return {
              json: () =>
                Promise.resolve({
                  success: false,
                  error: error.message,
                  code: "VALIDATION_ERROR",
                }),
              status: 400,
            };
          }
          // Generic error
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
    createSuccessResponse: jest
      .fn()
      .mockImplementation((data, message, status = 200) => ({
        json: () =>
          Promise.resolve({
            success: true,
            data,
            message,
          }),
        status,
        cookies: {
          set: jest.fn(),
        },
      })),
    handleApiError: jest.fn().mockImplementation((error: any) => {
      // Handle specific error types
      if (error.message === "Tech tag already exists") {
        return {
          json: () =>
            Promise.resolve({
              success: false,
              error: "Tech tag already exists",
              code: "CONFLICT",
            }),
          status: 409,
        };
      }
      if (error.message === "Tech tag not found") {
        return {
          json: () =>
            Promise.resolve({
              success: false,
              error: "Tech tag not found",
              code: "NOT_FOUND",
            }),
          status: 404,
        };
      }
      if (error.message === "Tech tag with this name already exists") {
        return {
          json: () =>
            Promise.resolve({
              success: false,
              error: "Tech tag with this name already exists",
              code: "CONFLICT",
            }),
          status: 409,
        };
      }
      if (
        error.message ===
        "Cannot delete tech tag. It is currently being used by projects or archive projects."
      ) {
        return {
          json: () =>
            Promise.resolve({
              success: false,
              error:
                "Cannot delete tech tag. It is currently being used by projects or archive projects.",
              code: "CONFLICT",
            }),
          status: 409,
        };
      }
      if (
        error.message === "Tag name is required" ||
        error.message === "At least one tag is required" ||
        error.message === "Invalid UUID format"
      ) {
        return {
          json: () =>
            Promise.resolve({
              success: false,
              error: error.message,
              code: "VALIDATION_ERROR",
            }),
          status: 400,
        };
      }
      return {
        json: () =>
          Promise.resolve({
            success: false,
            error: error.message || "Internal server error",
            code: "INTERNAL_ERROR",
          }),
        status: 500,
      };
    }),
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
      public statusCode: number;
      public code: string;

      constructor(message = "Authentication required") {
        super(message);
        this.name = "AuthenticationError";
        this.statusCode = 401;
        this.code = "AUTHENTICATION_ERROR";
      }
    },
    AuthorizationError: class AuthorizationError extends Error {
      public statusCode: number;
      public code: string;

      constructor(message = "Insufficient permissions") {
        super(message);
        this.name = "AuthorizationError";
        this.statusCode = 403;
        this.code = "AUTHORIZATION_ERROR";
      }
    },
    NotFoundError: class NotFoundError extends Error {
      public statusCode: number;
      public code: string;

      constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
        this.code = "NOT_FOUND";
      }
    },
    ConflictError: class ConflictError extends Error {
      public statusCode: number;
      public code: string;

      constructor(message = "Resource already exists") {
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409;
        this.code = "CONFLICT";
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
  jest.mock("@/lib/validation", () => {
    const { z } = require("zod");
    return {
      validateRequest: jest.fn().mockImplementation((schema, data) => {
        // Handle specific validation scenarios
        if (data && typeof data === "object") {
          const dataAsAny = data as any; // Cast to any to allow property access in this mock
          if (dataAsAny.tag === "") {
            return {
              success: false,
              errors: new Error("Tag name is required"),
            };
          }
          if (dataAsAny.tags && dataAsAny.tags.length === 0) {
            return {
              success: false,
              errors: new Error("At least one tag is required"),
            };
          }
          if (
            dataAsAny.tagIds &&
            dataAsAny.tagIds.includes("invalid-objectid")
          ) {
            return {
              success: false,
              errors: new Error("Invalid ObjectId format"),
            };
          }
        }
        // Handle ObjectId validation for route parameters
        if (typeof data === "string" && data === "invalid-objectid") {
          return {
            success: false,
            errors: new Error("Invalid ObjectId format"),
          };
        }
        // For all other cases, return success
        return { success: true, data };
      }),
      objectIdSchema: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
      uuidSchema: z.string().uuid("Invalid UUID format"),
      createTechTagSchema: z.object({
        tag: z.string().min(1, "Tag name is required").max(50).trim(),
      }),
      bulkCreateTechTagsSchema: z.object({
        tags: z
          .array(z.string().min(1, "Tag name is required").max(50).trim())
          .min(1, "At least one tag is required")
          .max(50, "Cannot create more than 50 tags at once"),
      }),
      bulkDeleteTechTagsSchema: z.object({
        tagIds: z
          .array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")
          )
          .min(1, "At least one tag ID is required")
          .max(50, "Cannot delete more than 50 tags at once"),
      }),
      validateRequestSize: jest.fn().mockReturnValue(true),
      emailSchema: { parse: jest.fn().mockReturnValue("test@example.com") },
      passwordSchema: { parse: jest.fn().mockReturnValue("password123") },
      loginSchema: {
        parse: jest.fn().mockReturnValue({
          email: "test@example.com",
          password: "password123",
        }),
      },
      registerSchema: {
        parse: jest.fn().mockReturnValue({
          email: "test@example.com",
          password: "password123",
          name: "Test User",
        }),
      },
      resetPasswordSchema: {
        parse: jest.fn().mockReturnValue({
          email: "test@example.com",
          password: "password123",
        }),
      },
      createProjectSchema: { parse: jest.fn().mockReturnValue({}) },
      updateProjectSchema: { parse: jest.fn().mockReturnValue({}) },
      createPortfolioSchema: { parse: jest.fn().mockReturnValue({}) },
      updatePortfolioSchema: { parse: jest.fn().mockReturnValue({}) },
      createTechOptionSchema: { parse: jest.fn().mockReturnValue({}) },
      inviteUserSchema: { parse: jest.fn().mockReturnValue({}) },
      updateConfigSchema: {
        parse: jest.fn().mockImplementation((data) => {
          // Check if all required fields are present and valid
          if (!data || typeof data !== "object") {
            throw new Error("Invalid data");
          }

          // Assert the type of data after the initial check to include the expected properties
          const typedData = data as {
            maxWebProjects?: number;
            maxDesignProjects?: number;
            maxTotalProjects?: number;
          };

          const { maxWebProjects, maxDesignProjects, maxTotalProjects } =
            typedData;

          // Check if all required fields are present
          if (
            maxWebProjects === undefined ||
            maxDesignProjects === undefined ||
            maxTotalProjects === undefined
          ) {
            throw new Error("Missing required fields");
          }

          // Check if all fields are numbers
          if (
            typeof maxWebProjects !== "number" ||
            typeof maxDesignProjects !== "number" ||
            typeof maxTotalProjects !== "number"
          ) {
            throw new Error("Invalid data types");
          }

          // Check if all fields are within valid ranges
          if (
            maxWebProjects < 1 ||
            maxWebProjects > 100 ||
            maxDesignProjects < 1 ||
            maxDesignProjects > 100 ||
            maxTotalProjects < 1 ||
            maxTotalProjects > 200
          ) {
            throw new Error("Values out of range");
          }

          return data;
        }),
      },
      createArchiveProjectSchema: { parse: jest.fn().mockReturnValue({}) },
      updateArchiveProjectSchema: { parse: jest.fn().mockReturnValue({}) },
    };
  });
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

  // Reset validation mocks
  const { updateConfigSchema } = require("@/lib/validation");
  if (
    updateConfigSchema &&
    updateConfigSchema.parse &&
    jest.isMockFunction(updateConfigSchema.parse)
  ) {
    updateConfigSchema.parse.mockReset();
    updateConfigSchema.parse.mockImplementation(
      (data: {
        maxWebProjects: number;
        maxDesignProjects: number;
        maxTotalProjects: number;
      }) => {
        // Check if all required fields are present and valid
        if (!data || typeof data !== "object") {
          throw new Error("Invalid data");
        }

        const { maxWebProjects, maxDesignProjects, maxTotalProjects } = data;

        // Check if all required fields are present
        if (
          maxWebProjects === undefined ||
          maxDesignProjects === undefined ||
          maxTotalProjects === undefined
        ) {
          throw new Error("Missing required fields");
        }

        // Check if all fields are numbers
        if (
          typeof maxWebProjects !== "number" ||
          typeof maxDesignProjects !== "number" ||
          typeof maxTotalProjects !== "number"
        ) {
          throw new Error("Invalid data types");
        }

        // Check if all fields are within valid ranges
        if (
          maxWebProjects < 1 ||
          maxWebProjects > 100 ||
          maxDesignProjects < 1 ||
          maxDesignProjects > 100 ||
          maxTotalProjects < 1 ||
          maxTotalProjects > 200
        ) {
          throw new Error("Values out of range");
        }

        return data;
      }
    );
  }

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
