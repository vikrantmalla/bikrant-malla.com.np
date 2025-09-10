import { GET } from '@/app/api/auth/check-role/route';
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

      const response = await GET(mockRequest);
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

      const response = await GET(mockRequest);
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

      const response = await GET(mockRequest);
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

      const response = await GET(mockRequest);
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

      const response = await GET(mockRequest);
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

      const response = await GET(mockRequest);
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

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
