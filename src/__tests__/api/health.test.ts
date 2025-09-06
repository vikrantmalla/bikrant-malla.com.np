import { GET } from '@/app/api/health/database/route';
import { setupMocks, resetMocks, mockPrisma } from '../setup/mocks';

// Setup mocks before importing modules
setupMocks();

describe('/api/health/database', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('GET /api/health/database', () => {
    it('should return healthy status when database is connected', async () => {
      // Mock successful database ping
      mockPrisma.$runCommandRaw.mockResolvedValue({ ok: 1 });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        status: 'healthy',
        database: 'connected',
        timestamp: expect.any(String)
      });
      expect(mockPrisma.$runCommandRaw).toHaveBeenCalledWith({ ping: 1 });
      expect(mockPrisma.$runCommandRaw).toHaveBeenCalledTimes(1);
    });

    it('should return unhealthy status when database connection fails', async () => {
      // Mock database connection failure
      const dbError = new Error('MongoDB connection failed');
      mockPrisma.$runCommandRaw.mockRejectedValue(dbError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        database: 'disconnected',
        error: 'MongoDB connection failed',
        timestamp: expect.any(String)
      });
      expect(mockPrisma.$runCommandRaw).toHaveBeenCalledWith({ ping: 1 });
    });

    it('should handle authentication errors', async () => {
      // Mock authentication failure
      const authError = new Error('SCRAM failure: bad auth : authentication failed');
      mockPrisma.$runCommandRaw.mockRejectedValue(authError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        database: 'disconnected',
        error: 'SCRAM failure: bad auth : authentication failed',
        timestamp: expect.any(String)
      });
    });

    it('should handle network timeout errors', async () => {
      // Mock network timeout
      const timeoutError = new Error('Connection timeout');
      mockPrisma.$runCommandRaw.mockRejectedValue(timeoutError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        database: 'disconnected',
        error: 'Connection timeout',
        timestamp: expect.any(String)
      });
    });

    it('should handle unknown error types', async () => {
      // Mock unknown error type
      const unknownError = 'Unknown error type';
      mockPrisma.$runCommandRaw.mockRejectedValue(unknownError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        database: 'disconnected',
        error: 'Unknown error',
        timestamp: expect.any(String)
      });
    });

    it('should include valid timestamp in response', async () => {
      const beforeRequest = new Date();
      mockPrisma.$runCommandRaw.mockResolvedValue({ ok: 1 });

      const response = await GET();
      const data = await response.json();
      const afterRequest = new Date();

      const responseTime = new Date(data.timestamp);
      
      expect(responseTime.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime());
      expect(responseTime.getTime()).toBeLessThanOrEqual(afterRequest.getTime());
    });

    it('should handle database name errors', async () => {
      // Mock database name error
      const dbNameError = new Error('empty database name not allowed');
      mockPrisma.$runCommandRaw.mockRejectedValue(dbNameError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        database: 'disconnected',
        error: 'empty database name not allowed',
        timestamp: expect.any(String)
      });
    });

    it('should handle Atlas errors', async () => {
      // Mock Atlas-specific error
      const atlasError = new Error('AtlasError: Cluster not found');
      mockPrisma.$runCommandRaw.mockRejectedValue(atlasError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        database: 'disconnected',
        error: 'AtlasError: Cluster not found',
        timestamp: expect.any(String)
      });
    });
  });
});
