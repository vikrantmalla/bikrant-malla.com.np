import { GET } from '@/app/api/auth/check-role/route';
import { setupMocks, resetMocks, mockPrisma, mockKindeAuth } from '../setup/mocks';
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
      const userWithRoles = {
        ...user,
        roles: [
          {
            id: faker.string.uuid(),
            role: 'EDITOR',
            portfolio: portfolio,
          },
        ],
      };

      // Mock authentication
      mockKindeAuth.getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue({
          id: user.kindeUserId,
          email: user.email,
          given_name: (user.name || '').split(' ')[0],
          family_name: (user.name || '').split(' ')[1] || '',
        }),
      });

      // Mock database calls
      mockPrisma.$connect.mockResolvedValue(undefined);
      mockPrisma.user.findUnique.mockResolvedValue(userWithRoles);
      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolio);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        email: user.email,
        name: user.name,
        hasEditorRole: true,
        isOwner: true,
        roles: userWithRoles.roles,
        portfolio: {
          id: portfolio.id,
          name: portfolio.name,
          ownerEmail: portfolio.ownerEmail,
        },
      });
    });

    it('should return user without editor role when not owner and no editor role', async () => {
      const user = generateTestUser();
      const userWithRoles = {
        ...user,
        roles: [], // No roles
      };

      // Mock authentication
      mockKindeAuth.getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue({
          id: user.kindeUserId,
          email: user.email,
          given_name: (user.name || '').split(' ')[0],
          family_name: (user.name || '').split(' ')[1] || '',
        }),
      });

      // Mock database calls
      mockPrisma.$connect.mockResolvedValue(undefined);
      mockPrisma.user.findUnique.mockResolvedValue(userWithRoles);
      mockPrisma.portfolio.findFirst.mockResolvedValue(null); // Not owner

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        email: user.email,
        name: user.name,
        hasEditorRole: false,
        isOwner: false,
        roles: [],
        portfolio: null,
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock no authentication
      mockKindeAuth.getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue(null),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 401 when user has no email', async () => {
      // Mock user without email
      mockKindeAuth.getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue({
          id: faker.string.uuid(),
          // No email
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not found in database', async () => {
      const user = generateTestUser();

      // Mock authentication
      mockKindeAuth.getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue({
          id: user.kindeUserId,
          email: user.email,
          given_name: (user.name || '').split(' ')[0],
          family_name: (user.name || '').split(' ')[1] || '',
        }),
      });

      // Mock user not found in database
      mockPrisma.$connect.mockResolvedValue(undefined);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    it('should handle database connection errors', async () => {
      const user = generateTestUser();

      // Mock authentication
      mockKindeAuth.getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue({
          id: user.kindeUserId,
          email: user.email,
          given_name: (user.name || '').split(' ')[0],
          family_name: (user.name || '').split(' ')[1] || '',
        }),
      });

      // Mock database connection error
      mockPrisma.$connect.mockRejectedValue(new Error('Database connection failed'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle database query errors', async () => {
      const user = generateTestUser();

      // Mock authentication
      mockKindeAuth.getKindeServerSession.mockReturnValue({
        getUser: jest.fn().mockResolvedValue({
          id: user.kindeUserId,
          email: user.email,
          given_name: (user.name || '').split(' ')[0],
          family_name: (user.name || '').split(' ')[1] || '',
        }),
      });

      // Mock database query error
      mockPrisma.$connect.mockResolvedValue(); // Fix: $connect typically resolves without a specific value, or to void.
      mockPrisma.user.findUnique.mockImplementation(() => Promise.reject(new Error('Database query failed'))); // Fix: Use mockImplementation to explicitly return a rejected promise, addressing potential type inference issues with mockRejectedValue.

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
