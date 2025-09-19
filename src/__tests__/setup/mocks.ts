// Mock setup for API tests
import { jest } from '@jest/globals';

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
  jest.mock('@/lib/prisma', () => ({
    prisma: mockPrisma,
  }));

  // Mock custom authentication
  jest.mock('@/lib/auth', () => ({
    getUserFromToken: mockCustomAuth.getUserFromToken,
    getUserFromCookie: mockCustomAuth.getUserFromCookie,
    checkUserPermissions: mockCustomAuth.checkUserPermissions,
    generateAuthTokens: mockCustomAuth.generateAuthTokens,
    isValidEmail: jest.fn().mockReturnValue(true),
  }));

  // Mock JWT utilities
  jest.mock('@/lib/jwt', () => ({
    verifyToken: jest.fn().mockReturnValue({ userId: 'mock-user-id', email: 'mock@example.com' }),
    verifyRefreshToken: jest.fn().mockReturnValue({ userId: 'mock-user-id', email: 'mock@example.com' }),
    generateToken: jest.fn().mockReturnValue('mock-token'),
  }));

  // Mock Next.js
  jest.mock('next/server', () => mockNextJS);

  // Mock role utilities
  jest.mock('@/lib/roleUtils', () => ({
    checkEditorPermissions: jest.fn() as jest.MockedFunction<any>,
    checkPortfolioAccess: jest.fn() as jest.MockedFunction<any>,
    checkEditorRole: jest.fn() as jest.MockedFunction<any>,
    checkOwnerRole: jest.fn() as jest.MockedFunction<any>,
  }));
}

// Reset all mocks
export function resetMocks() {
  Object.values(mockPrisma).forEach((model: any) => {
    if (model && typeof model === 'object') {
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
