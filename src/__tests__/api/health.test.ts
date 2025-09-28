import { GET } from "@/app/api/health/database/route";
import { setupMocks, resetMocks, mockPrisma } from "../setup/mocks";
import { createMockRequest, TEST_BASE_URL } from "../utils/test-helpers";

// Setup mocks before importing modules
setupMocks();

describe("/api/health/database", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("GET /api/health/database", () => {
    it("should return healthy status when database is connected", async () => {
      // Mock successful database ping
      mockPrisma.$runCommandRaw.mockResolvedValue({ ok: 1 });

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Database health check successful");
      expect(data.data).toEqual({
        status: "healthy",
        database: "connected",
        timestamp: expect.any(String),
      });
      expect(mockPrisma.$runCommandRaw).toHaveBeenCalledWith({ ping: 1 });
      expect(mockPrisma.$runCommandRaw).toHaveBeenCalledTimes(1);
    });

    it("should return unhealthy status when database connection fails", async () => {
      // Mock database connection failure
      const dbError = new Error("MongoDB connection failed");
      mockPrisma.$runCommandRaw.mockRejectedValue(dbError);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("MongoDB connection failed");
      expect(mockPrisma.$runCommandRaw).toHaveBeenCalledWith({ ping: 1 });
    });

    it("should handle authentication errors", async () => {
      // Mock authentication failure
      const authError = new Error(
        "SCRAM failure: bad auth : authentication failed"
      );
      mockPrisma.$runCommandRaw.mockRejectedValue(authError);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "SCRAM failure: bad auth : authentication failed"
      );
    });

    it("should handle network timeout errors", async () => {
      // Mock network timeout
      const timeoutError = new Error("Connection timeout");
      mockPrisma.$runCommandRaw.mockRejectedValue(timeoutError);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Connection timeout");
    });

    it("should handle unknown error types", async () => {
      // Mock unknown error type
      const unknownError = "Unknown error type";
      mockPrisma.$runCommandRaw.mockRejectedValue(unknownError);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });

    it("should include valid timestamp in response", async () => {
      const beforeRequest = new Date();
      mockPrisma.$runCommandRaw.mockResolvedValue({ ok: 1 });

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();
      const afterRequest = new Date();

      const responseTime = new Date(data.data.timestamp);

      expect(responseTime.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime()
      );
      expect(responseTime.getTime()).toBeLessThanOrEqual(
        afterRequest.getTime()
      );
    });

    it("should handle database name errors", async () => {
      // Mock database name error
      const dbNameError = new Error("empty database name not allowed");
      mockPrisma.$runCommandRaw.mockRejectedValue(dbNameError);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("empty database name not allowed");
    });

    it("should handle Atlas errors", async () => {
      // Mock Atlas-specific error
      const atlasError = new Error("AtlasError: Cluster not found");
      mockPrisma.$runCommandRaw.mockRejectedValue(atlasError);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/health/database`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("AtlasError: Cluster not found");
    });
  });
});
