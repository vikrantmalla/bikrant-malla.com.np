import {
  GET as getTechOptions,
  POST as createTechOption,
} from "@/app/api/tech-options/route";
import {
  GET as getTechOption,
  PUT as updateTechOption,
  DELETE as deleteTechOption,
} from "@/app/api/tech-options/[id]/route";
import {
  setupMocks,
  resetMocks,
  mockPrisma,
  mockCustomAuth,
} from "../setup/mocks";
import {
  generateTestUser,
  generateTestTechOption,
  generateTestPortfolio,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";

// Setup mocks before importing modules
setupMocks();

describe("/api/tech-options", () => {
  beforeEach(() => {
    resetMocks();
    // Reset validation mock to default behavior
    const { validateRequest } = require("@/lib/validation");
    validateRequest.mockImplementation((_schema: any, data: any) => {
      // Handle specific validation scenarios
      if (data && typeof data === "object") {
        const dataAsAny = data as any;
        if (dataAsAny.name === "") {
          return { success: false, errors: new Error("Name is required") };
        }
        if (dataAsAny.category === "") {
          return { success: false, errors: new Error("Category is required") };
        }
        if (dataAsAny.techOptions && dataAsAny.techOptions.length === 0) {
          return {
            success: false,
            errors: new Error("At least one tech option is required"),
          };
        }
        if (
          dataAsAny.techOptionIds &&
          dataAsAny.techOptionIds.includes("invalid-objectid")
        ) {
          return {
            success: false,
            errors: new Error("Invalid ObjectId format"),
          };
        }
      }
      // Handle ObjectId validation for route parameters
      if (typeof data === "string" && data === "invalid-objectid") {
        return { success: false, errors: new Error("Invalid ObjectId format") };
      }
      // For all other cases, return success
      return { success: true, data };
    });
  });

  describe("GET /api/tech-options", () => {
    it("should return all tech options successfully", async () => {
      const techOptions = [
        generateTestTechOption({ name: "React", category: "Frontend" }),
        generateTestTechOption({ name: "Node.js", category: "Backend" }),
        generateTestTechOption({ name: "PostgreSQL", category: "Database" }),
      ];

      mockPrisma.techOption.findMany.mockResolvedValue(techOptions);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechOptions(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(techOptions);
      expect(data.message).toBe("Tech options retrieved successfully");
      expect(mockPrisma.techOption.findMany).toHaveBeenCalledWith({
        orderBy: [{ category: "asc" }, { name: "asc" }],
      });
    });

    it("should handle database errors gracefully", async () => {
      mockPrisma.techOption.findMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechOptions(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database connection failed");
    });
  });

  describe("POST /api/tech-options", () => {
    const user = generateTestUser();
    const portfolio = generateTestPortfolio({ ownerEmail: user.email });

    beforeEach(() => {
      // Mock successful permission check
      const { checkEditorPermissions } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user,
        kindeUser: {
          id: user.id,
          email: user.email,
        },
      });
    });

    it("should create a new tech option successfully", async () => {
      const techOptionData = {
        name: faker.lorem.word(),
        category: faker.lorem.word(),
        description: faker.lorem.sentence(),
        isActive: faker.datatype.boolean(),
      };

      const newTechOption = generateTestTechOption(techOptionData);
      const requestBody = techOptionData;

      mockPrisma.techOption.findFirst.mockResolvedValue(null); // No existing option
      mockPrisma.techOption.create.mockResolvedValue(newTechOption);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechOption(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(newTechOption);
      expect(data.message).toBe("Tech option created successfully");
      expect(mockPrisma.techOption.create).toHaveBeenCalledWith({
        data: techOptionData,
      });
    });

    it("should create tech option with null description", async () => {
      const techOptionData = {
        name: faker.lorem.word(),
        category: faker.lorem.word(),
        description: null,
        isActive: faker.datatype.boolean(),
      };

      const newTechOption = generateTestTechOption(techOptionData);
      const requestBody = techOptionData;

      mockPrisma.techOption.findFirst.mockResolvedValue(null);
      mockPrisma.techOption.create.mockResolvedValue(newTechOption);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechOption(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(mockPrisma.techOption.create).toHaveBeenCalledWith({
        data: techOptionData,
      });
    });

    it("should return conflict error when tech option already exists in category", async () => {
      const existingOption = generateTestTechOption({
        name: "React",
        category: "Frontend",
      });
      const requestBody = { name: "React", category: "Frontend" };

      mockPrisma.techOption.findFirst.mockResolvedValue(existingOption);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechOption(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Tech option already exists in this category");
    });

    it("should handle validation errors", async () => {
      const requestBody = { name: "", category: "Frontend" };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechOption(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Name is required");
    });

    it("should handle permission denied", async () => {
      const { checkEditorPermissions } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: {
          status: 403,
          json: jest.fn().mockResolvedValue({ error: "Permission denied" }),
        },
      });

      const requestBody = { name: "React", category: "Frontend" };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechOption(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Permission denied");
    });
  });

  describe("GET /api/tech-options/[id]", () => {
    it("should return tech option by ID successfully", async () => {
      const techOption = generateTestTechOption({
        id: "507f1f77bcf86cd799439011",
        name: "React",
        category: "Frontend",
      });

      mockPrisma.techOption.findUnique.mockResolvedValue(techOption);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechOption(mockRequest, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(techOption);
      expect(data.message).toBe("Tech option retrieved successfully");
      expect(mockPrisma.techOption.findUnique).toHaveBeenCalledWith({
        where: { id: "507f1f77bcf86cd799439011" },
      });
    });

    it("should return 404 when tech option not found", async () => {
      mockPrisma.techOption.findUnique.mockResolvedValue(null);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechOption(mockRequest, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Tech option not found");
    });

    it("should return 400 for invalid ObjectId format", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechOption(mockRequest, {
        params: Promise.resolve({ id: "invalid-objectid" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid ObjectId format");
    });
  });

  describe("PUT /api/tech-options/[id]", () => {
    const user = generateTestUser();

    beforeEach(() => {
      const { checkEditorPermissions } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user,
        kindeUser: {
          id: user.id,
          email: user.email,
        },
      });
    });

    it("should update tech option successfully", async () => {
      const updatedTechOption = generateTestTechOption({
        id: "507f1f77bcf86cd799439011",
        name: "React 18",
        category: "Frontend",
        description: "Latest version of React",
      });
      const requestBody = {
        name: "React 18",
        category: "Frontend",
        description: "Latest version of React",
        isActive: true,
      };

      mockPrisma.techOption.findFirst.mockResolvedValue(null); // No conflict
      mockPrisma.techOption.update.mockResolvedValue(updatedTechOption);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await updateTechOption(mockRequest, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(updatedTechOption);
      expect(data.message).toBe("Tech option updated successfully");
    });

    it("should return conflict error when name already exists in category", async () => {
      const existingOption = generateTestTechOption({
        name: "Vue.js",
        category: "Frontend",
        id: "507f1f77bcf86cd799439012", // Different ID
      });
      const requestBody = { name: "Vue.js", category: "Frontend" };

      mockPrisma.techOption.findFirst.mockResolvedValue(existingOption);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await updateTechOption(mockRequest, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Tech option already exists in this category");
    });
  });

  describe("DELETE /api/tech-options/[id]", () => {
    const user = generateTestUser();

    beforeEach(() => {
      const { checkEditorPermissions } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user,
        kindeUser: {
          id: user.id,
          email: user.email,
        },
      });
    });

    it("should delete tech option successfully", async () => {
      mockPrisma.project.findMany.mockResolvedValue([]); // No projects using this tech option
      mockPrisma.techOption.delete.mockResolvedValue({});

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await deleteTechOption(mockRequest, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeNull();
      expect(data.message).toBe("Tech option deleted successfully");
    });

    it("should return conflict error when tech option is in use", async () => {
      const projectsUsingTech = [
        { id: "507f1f77bcf86cd799439021", title: "Project 1" },
        { id: "507f1f77bcf86cd799439022", title: "Project 2" },
      ];

      mockPrisma.project.findMany.mockResolvedValue(projectsUsingTech);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await deleteTechOption(mockRequest, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Cannot delete tech option. It is currently being used by 2 project(s)."
      );
    });
  });
});
