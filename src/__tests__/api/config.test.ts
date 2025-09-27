import { GET, PUT } from "@/app/api/config/route";
import { setupMocks, resetMocks, mockPrisma } from "../setup/mocks";
import {
  generateTestConfig,
  generateTestUser,
  createMockRequest,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";

// Setup mocks before importing modules
setupMocks();

describe("/api/config", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("GET /api/config", () => {
    it("should return existing config", async () => {
      const existingConfig = generateTestConfig();
      mockPrisma.config.findFirst.mockResolvedValue(existingConfig);

      const response = await GET(
        createMockRequest("http://localhost:3000/api/config")
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Config retrieved successfully");
      expect(data.data).toEqual(existingConfig);
      expect(mockPrisma.config.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.config.create).not.toHaveBeenCalled();
    });

    it("should create default config when none exists", async () => {
      const defaultConfig = generateTestConfig();
      mockPrisma.config.findFirst.mockResolvedValue(null);
      mockPrisma.config.create.mockResolvedValue(defaultConfig);

      const response = await GET(
        createMockRequest("http://localhost:3000/api/config")
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Config retrieved successfully");
      expect(data.data).toEqual(defaultConfig);
      expect(mockPrisma.config.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.config.create).toHaveBeenCalledWith({
        data: {
          maxWebProjects: 6,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        },
      });
    });

    it("should handle database errors", async () => {
      mockPrisma.config.findFirst.mockRejectedValue(
        new Error("Database error")
      );

      const response = await GET(
        createMockRequest("http://localhost:3000/api/config")
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });

  describe("PUT /api/config", () => {
    it("should update existing config with valid permissions", async () => {
      const user = generateTestUser();
      const { checkEditorPermissions } = require("@/lib/roleUtils");

      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });

      const existingConfig = generateTestConfig();
      const newMaxWebProjects = faker.number.int({ min: 1, max: 20 });
      const updatedConfig = {
        ...existingConfig,
        maxWebProjects: newMaxWebProjects,
      };

      mockPrisma.config.findFirst.mockResolvedValue(existingConfig);
      mockPrisma.config.update.mockResolvedValue(updatedConfig);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue({
          maxWebProjects: newMaxWebProjects,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        }),
      } as any;

      const response = await PUT(request);
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Config updated successfully");
      expect(data.data).toEqual(updatedConfig);
      expect(mockPrisma.config.update).toHaveBeenCalledWith({
        where: { id: existingConfig.id },
        data: {
          maxWebProjects: newMaxWebProjects,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        },
      });
    });

    it("should create new config when none exists", async () => {
      const user = generateTestUser();
      const { checkEditorPermissions } = require("@/lib/roleUtils");

      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });

      const newConfig = generateTestConfig();
      const newMaxWebProjects = faker.number.int({ min: 1, max: 20 });
      mockPrisma.config.findFirst.mockResolvedValue(null);
      mockPrisma.config.create.mockResolvedValue(newConfig);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue({
          maxWebProjects: newMaxWebProjects,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        }),
      } as any;

      const response = await PUT(request);
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Config updated successfully");
      expect(data.data).toEqual(newConfig);
      expect(mockPrisma.config.create).toHaveBeenCalledWith({
        data: {
          maxWebProjects: newMaxWebProjects,
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        },
      });
    });

    it("should return 401 when user is not authenticated", async () => {
      const { checkEditorPermissions } = require("@/lib/roleUtils");

      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: { json: () => ({ error: "Unauthorized" }), status: 401 },
        user: null,
      });

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue({
          maxWebProjects: faker.number.int({ min: 1, max: 20 }),
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        }),
      } as any;

      const response = await PUT(request);

      expect(response!.status).toBe(401);
      expect(mockPrisma.config.findFirst).not.toHaveBeenCalled();
    });


    it("should handle database errors", async () => {
      const user = generateTestUser();
      const { checkEditorPermissions } = require("@/lib/roleUtils");

      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });

      mockPrisma.config.findFirst.mockRejectedValue(
        new Error("Database error")
      );

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue({
          maxWebProjects: faker.number.int({ min: 1, max: 20 }),
          maxDesignProjects: 6,
          maxTotalProjects: 12,
        }),
      } as any;

      const response = await PUT(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });
});
