import { GET, PUT } from '@/app/api/config/route';
import { setupMocks, resetMocks, mockPrisma } from '../setup/mocks';
import { generateTestConfig, generateTestUser, createMockRequest } from '../utils/test-helpers';
import { faker } from '@faker-js/faker';

// Setup mocks before importing modules
setupMocks();

describe('/api/config', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('GET /api/config', () => {
    it('should return existing config', async () => {
      const existingConfig = generateTestConfig();
      mockPrisma.config.findFirst.mockResolvedValue(existingConfig);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(existingConfig);
      expect(mockPrisma.config.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.config.create).not.toHaveBeenCalled();
    });

    it('should create default config when none exists', async () => {
      const defaultConfig = generateTestConfig();
      mockPrisma.config.findFirst.mockResolvedValue(null);
      mockPrisma.config.create.mockResolvedValue(defaultConfig);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(defaultConfig);
      expect(mockPrisma.config.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.config.create).toHaveBeenCalledWith({
        data: {
          maxWebProjects: 6,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        },
      });
    });

    it('should handle database errors', async () => {
      mockPrisma.config.findFirst.mockRejectedValue(new Error('Database error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('PUT /api/config', () => {
    it('should update existing config with valid permissions', async () => {
      const user = generateTestUser();
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user,
        kindeUser: { email: user.email },
      });

      const existingConfig = generateTestConfig();
      const newMaxWebProjects = faker.number.int({ min: 1, max: 20 });
      const updatedConfig = { ...existingConfig, maxWebProjects: newMaxWebProjects };
      
      mockPrisma.config.findFirst.mockResolvedValue(existingConfig);
      mockPrisma.config.update.mockResolvedValue(updatedConfig);

      const request = createMockRequest('http://localhost:3000/api/config', {
        method: 'PUT',
        body: JSON.stringify({ maxWebProjects: newMaxWebProjects }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT(request);
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data).toEqual(updatedConfig);
      expect(mockPrisma.config.update).toHaveBeenCalledWith({
        where: { id: existingConfig.id },
        data: { maxWebProjects: newMaxWebProjects },
      });
    });

    it('should create new config when none exists', async () => {
      const user = generateTestUser();
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user,
        kindeUser: { email: user.email },
      });

      const newConfig = generateTestConfig();
      const newMaxWebProjects = faker.number.int({ min: 1, max: 20 });
      mockPrisma.config.findFirst.mockResolvedValue(null);
      mockPrisma.config.create.mockResolvedValue(newConfig);

      const request = createMockRequest('http://localhost:3000/api/config', {
        method: 'PUT',
        body: JSON.stringify({ maxWebProjects: newMaxWebProjects }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT(request);
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data).toEqual(newConfig);
      expect(mockPrisma.config.create).toHaveBeenCalledWith({
        data: {
          maxWebProjects: newMaxWebProjects,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        },
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      
      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: { json: () => ({ error: 'Unauthorized' }), status: 401 },
        user: null,
        kindeUser: null,
      });

      const request = createMockRequest('http://localhost:3000/api/config', {
        method: 'PUT',
        body: JSON.stringify({ maxWebProjects: faker.number.int({ min: 1, max: 20 }) }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT(request);

      expect(response!.status).toBe(401);
      expect(mockPrisma.config.findFirst).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const user = generateTestUser();
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user,
        kindeUser: { email: user.email },
      });

      mockPrisma.config.findFirst.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest('http://localhost:3000/api/config', {
        method: 'PUT',
        body: JSON.stringify({ maxWebProjects: faker.number.int({ min: 1, max: 20 }) }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await PUT(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
