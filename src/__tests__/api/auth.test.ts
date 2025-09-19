import { GET as getCheckRole } from '@/app/api/auth/check-role/route';
import { GET as getMe } from '@/app/api/auth/me/route';
import { setupMocks, resetMocks, mockPrisma, mockCustomAuth } from '../setup/mocks';
import { generateTestUser, generateTestPortfolio } from '../utils/test-helpers';
import { faker } from '@faker-js/faker';

// Setup mocks before importing modules
setupMocks();

describe('/api/auth/check-role', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('GET /api/auth/check-role', () => {
    it('should return user role information for authenticated user', async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
        emailVerified: true,
      };
      const permissionCheck = {
        user: authUser,
        hasEditorRole: true,
        isOwner: true,
        portfolio: {
          id: portfolio.id,
          name: portfolio.name,
          ownerEmail: portfolio.ownerEmail,
        },
      };

      // Mock authentication
      mockCustomAuth.getUserFromToken.mockResolvedValue({
        user: authUser,
      });
      mockCustomAuth.checkUserPermissions.mockResolvedValue(permissionCheck);

      // Create mock request with authorization header
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer mock-token'),
        },
      } as any;

      const response = await getCheckRole(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        email: user.email,
        name: user.name,
        hasEditorRole: true,
        isOwner: true,
        portfolio: {
          id: portfolio.id,
          name: portfolio.name,
          ownerEmail: portfolio.ownerEmail,
        },
      });
    });

    it('should return user without editor role when not owner and no editor role', async () => {
      const user = generateTestUser();
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
        emailVerified: true,
      };
      const permissionCheck = {
        user: authUser,
        hasEditorRole: false,
        isOwner: false,
        portfolio: null,
      };

      // Mock authentication
      mockCustomAuth.getUserFromToken.mockResolvedValue({
        user: authUser,
      });
      mockCustomAuth.checkUserPermissions.mockResolvedValue(permissionCheck);

      // Create mock request with authorization header
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer mock-token'),
        },
      } as any;

      const response = await getCheckRole(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        email: user.email,
        name: user.name,
        hasEditorRole: false,
        isOwner: false,
        portfolio: null,
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock no authentication
      mockCustomAuth.getUserFromToken.mockResolvedValue({
        user: null,
        error: 'No token provided',
      });

      // Create mock request without authorization header
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as any;

      const response = await getCheckRole(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('No token provided');
      expect(mockCustomAuth.checkUserPermissions).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      // Mock invalid token
      mockCustomAuth.getUserFromToken.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Create mock request with invalid token
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer invalid-token'),
        },
      } as any;

      const response = await getCheckRole(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
      expect(mockCustomAuth.checkUserPermissions).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not found in database', async () => {
      const user = generateTestUser();
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
        emailVerified: true,
      };

      // Mock authentication
      mockCustomAuth.getUserFromToken.mockResolvedValue({
        user: authUser,
      });
      mockCustomAuth.checkUserPermissions.mockResolvedValue({
        user: null,
        hasEditorRole: false,
        isOwner: false,
        portfolio: null,
      });

      // Create mock request with authorization header
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer mock-token'),
        },
      } as any;

      const response = await getCheckRole(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    it('should handle database connection errors', async () => {
      const user = generateTestUser();
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
        emailVerified: true,
      };

      // Mock authentication
      mockCustomAuth.getUserFromToken.mockResolvedValue({
        user: authUser,
      });
      mockCustomAuth.checkUserPermissions.mockRejectedValue(new Error('Database connection failed'));

      // Create mock request with authorization header
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer mock-token'),
        },
      } as any;

      const response = await getCheckRole(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle database query errors', async () => {
      const user = generateTestUser();
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
        emailVerified: true,
      };

      // Mock authentication
      mockCustomAuth.getUserFromToken.mockResolvedValue({
        user: authUser,
      });
      mockCustomAuth.checkUserPermissions.mockRejectedValue(new Error('Database query failed'));

      // Create mock request with authorization header
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer mock-token'),
        },
      } as any;

      const response = await getCheckRole(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});

describe('/api/auth/me', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('GET /api/auth/me', () => {
    it('should return user information for authenticated user with valid access token', async () => {
      const user = generateTestUser();
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
        emailVerified: true,
      };

      // Mock successful authentication from cookie
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: authUser,
      });

      // Create mock request with access token cookie
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'valid-access-token' };
            }
            return undefined;
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: true,
        emailVerified: true,
      });
      expect(mockCustomAuth.getUserFromCookie).toHaveBeenCalledWith(mockRequest);
    });

    it('should return 401 when access token is expired and refresh token is invalid', async () => {
      // Mock expired access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Mock invalid refresh token
      const mockJWT = require('@/lib/jwt');
      mockJWT.verifyRefreshToken.mockReturnValue(null);

      // Create mock request with both access and refresh tokens
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'expired-access-token' };
            }
            if (name === 'refreshToken') {
              return { value: 'invalid-refresh-token' };
            }
            return undefined;
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should return 401 when no access token is provided', async () => {
      // Mock no access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'No access token found',
      });

      // Create mock request without access token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('No access token found');
    });

    it('should return 401 when access token is invalid and no refresh token', async () => {
      // Mock invalid access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Create mock request with invalid access token but no refresh token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'invalid-access-token' };
            }
            return undefined; // No refresh token
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should return 401 when refresh token is invalid', async () => {
      // Mock expired access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Mock invalid refresh token
      const mockJWT = require('@/lib/jwt');
      mockJWT.verifyRefreshToken.mockReturnValueOnce(null);

      // Create mock request with invalid refresh token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'expired-access-token' };
            }
            if (name === 'refreshToken') {
              return { value: 'invalid-refresh-token' };
            }
            return undefined;
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should return 401 when user is not found during token refresh', async () => {
      // Mock expired access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Mock valid refresh token but user not found
      const mockJWT = require('@/lib/jwt');
      mockJWT.verifyRefreshToken.mockReturnValueOnce({ userId: 'non-existent-user-id', email: 'test@example.com' });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Create mock request with refresh token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'expired-access-token' };
            }
            if (name === 'refreshToken') {
              return { value: 'valid-refresh-token' };
            }
            return undefined;
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should return 401 when user is inactive during token refresh', async () => {
      const user = generateTestUser();
      const inactiveUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: false, // Inactive user
        emailVerified: true,
      };

      // Mock expired access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Mock valid refresh token but inactive user
      const mockJWT = require('@/lib/jwt');
      mockJWT.verifyRefreshToken.mockReturnValueOnce({ userId: user.id, email: user.email });
      mockPrisma.user.findUnique.mockResolvedValue(inactiveUser);

      // Create mock request with refresh token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'expired-access-token' };
            }
            if (name === 'refreshToken') {
              return { value: 'valid-refresh-token' };
            }
            return undefined;
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should handle token refresh errors gracefully', async () => {
      // Mock expired access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Mock refresh token verification throwing error
      const mockJWT = require('@/lib/jwt');
      mockJWT.verifyRefreshToken.mockImplementationOnce(() => {
        throw new Error('JWT verification failed');
      });

      // Create mock request with refresh token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'expired-access-token' };
            }
            if (name === 'refreshToken') {
              return { value: 'valid-refresh-token' };
            }
            return undefined;
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should handle database errors during token refresh', async () => {
      // Mock expired access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Mock valid refresh token but database error
      const mockJWT = require('@/lib/jwt');
      mockJWT.verifyRefreshToken.mockReturnValueOnce({ userId: 'user-id', email: 'test@example.com' });
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

      // Create mock request with refresh token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'expired-access-token' };
            }
            if (name === 'refreshToken') {
              return { value: 'valid-refresh-token' };
            }
            return undefined;
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should handle general errors gracefully', async () => {
      // Mock authentication throwing error
      mockCustomAuth.getUserFromCookie.mockRejectedValue(new Error('Unexpected error'));

      // Create mock request
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'some-token' }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should return 401 when access token is expired and no refresh token provided', async () => {
      // Mock expired access token
      mockCustomAuth.getUserFromCookie.mockResolvedValue({
        user: null,
        error: 'Invalid token',
      });

      // Create mock request with expired access token but no refresh token
      const mockRequest = {
        cookies: {
          get: jest.fn().mockImplementation((name: string) => {
            if (name === 'accessToken') {
              return { value: 'expired-access-token' };
            }
            return undefined; // No refresh token
          }),
        },
      } as any;

      const response = await getMe(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });
  });
});
