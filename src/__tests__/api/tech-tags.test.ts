import {
  GET as getTechTags,
  POST as createTechTag,
} from "@/app/api/tech-tags/route";
import {
  GET as getTechTag,
  PUT as updateTechTag,
  DELETE as deleteTechTag,
} from "@/app/api/tech-tags/[id]/route";
import {
  setupMocks,
  resetMocks,
  mockPrisma,
  mockCustomAuth,
} from "../setup/mocks";
import {
  generateTestUser,
  generateTestTechTag,
  generateTestPortfolio,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";

// Setup mocks before importing modules
setupMocks();

describe("/api/tech-tags", () => {
  beforeEach(() => {
    resetMocks();
    // Reset validation mock to default behavior
    const { validateRequest } = require("@/lib/validation");
    validateRequest.mockImplementation((_schema: any, data: string) => {
      // Handle specific validation scenarios
      if (data && typeof data === "object") {
        const dataAsAny = data as any;
        if (dataAsAny.tag === "") {
          return { success: false, errors: new Error("Tag name is required") };
        }
        if (dataAsAny.tags && dataAsAny.tags.length === 0) {
          return {
            success: false,
            errors: new Error("At least one tag is required"),
          };
        }
        if (dataAsAny.tagIds && dataAsAny.tagIds.includes("invalid-objectid")) {
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

  describe("GET /api/tech-tags", () => {
    it("should return all tech tags successfully", async () => {
      const techTags = [
        generateTestTechTag({ tag: "React" }),
        generateTestTechTag({ tag: "TypeScript" }),
        generateTestTechTag({ tag: "Next.js" }),
      ];

      mockPrisma.techTag.findMany.mockResolvedValue(techTags);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(techTags);
      expect(data.message).toBe("Tech tags retrieved successfully");
      expect(mockPrisma.techTag.findMany).toHaveBeenCalledWith({
        orderBy: {
          tag: "asc",
        },
      });
    });

    it("should handle database errors gracefully", async () => {
      mockPrisma.techTag.findMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database connection failed");
    });
  });

  describe("POST /api/tech-tags", () => {
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

    it("should create a new tech tag successfully", async () => {
      const newTechTag = generateTestTechTag({ tag: "Vue.js" });
      const requestBody = { tag: "Vue.js" };

      mockPrisma.techTag.findFirst.mockResolvedValue(null); // No existing tag
      mockPrisma.techTag.create.mockResolvedValue(newTechTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(newTechTag);
      expect(data.message).toBe("Tech tag created successfully");
      expect(mockPrisma.techTag.create).toHaveBeenCalledWith({
        data: {
          tag: "Vue.js",
        },
      });
    });

    it("should return conflict error when tag already exists", async () => {
      const existingTag = generateTestTechTag({ tag: "React" });
      const requestBody = { tag: "React" };

      mockPrisma.techTag.findFirst.mockResolvedValue(existingTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Tech tag already exists");
    });

    it("should return validation error for invalid input", async () => {
      const requestBody = { tag: "" }; // Invalid empty tag

      // Mock validation to fail
      const { validateRequest } = require("@/lib/validation");
      validateRequest.mockImplementation(
        (_schema: any, data: { tag: string }) => {
          if (data && typeof data === "object" && data.tag === "") {
            return {
              success: false,
              errors: new Error("Tag name is required"),
            };
          }
          return { success: true, data };
        }
      );

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return unauthorized error when permission check fails", async () => {
      const { checkEditorPermissions } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: { json: () => ({ error: "Unauthorized" }), status: 401 },
        user: null,
        kindeUser: null,
      });

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue({ tag: "React" }),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });
});

describe("/api/tech-tags/[id]", () => {
  const techTagId = "68c6df05ad9309b10f79dcae"; // Valid ObjectId format
  const user = generateTestUser();

  describe("GET /api/tech-tags/[id]", () => {
    it("should return tech tag by ID successfully", async () => {
      const techTag = {
        ...generateTestTechTag({
          id: techTagId,
          tag: "React",
        }),
        projectRelations: [],
        archiveProjectRelations: [],
      };

      mockPrisma.techTag.findUnique.mockResolvedValue(techTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechTag(mockRequest, {
        params: Promise.resolve({ id: techTagId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(techTag);
      expect(data.message).toBe("Tech tag retrieved successfully");
      expect(mockPrisma.techTag.findUnique).toHaveBeenCalledWith({
        where: { id: techTagId },
        include: {
          projectRelations: {
            include: {
              project: true,
            },
          },
          archiveProjectRelations: {
            include: {
              archiveProject: true,
            },
          },
        },
      });
    });

    it("should return 404 when tech tag not found", async () => {
      mockPrisma.techTag.findUnique.mockResolvedValue(null);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechTag(mockRequest, {
        params: Promise.resolve({ id: techTagId }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Tech tag not found");
    });

    it("should return validation error for invalid ObjectId", async () => {
      const invalidId = "invalid-objectid";

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await getTechTag(mockRequest, {
        params: Promise.resolve({ id: invalidId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe("PUT /api/tech-tags/[id]", () => {
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

    it("should update tech tag successfully", async () => {
      const updatedTechTag = generateTestTechTag({
        id: techTagId,
        tag: "Vue.js",
      });
      const requestBody = { tag: "Vue.js" };

      mockPrisma.techTag.findFirst.mockResolvedValue(null); // No conflicting tag
      mockPrisma.techTag.update.mockResolvedValue(updatedTechTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await updateTechTag(mockRequest, {
        params: Promise.resolve({ id: techTagId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(updatedTechTag);
      expect(data.message).toBe("Tech tag updated successfully");
      expect(mockPrisma.techTag.update).toHaveBeenCalledWith({
        where: { id: techTagId },
        data: { tag: "Vue.js" },
      });
    });

    it("should return conflict error when tag name already exists", async () => {
      const existingTag = generateTestTechTag({
        id: "other-id",
        tag: "Vue.js",
      });
      const requestBody = { tag: "Vue.js" };

      mockPrisma.techTag.findFirst.mockResolvedValue(existingTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await updateTechTag(mockRequest, {
        params: Promise.resolve({ id: techTagId }),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Tech tag with this name already exists");
    });
  });

  describe("DELETE /api/tech-tags/[id]", () => {
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

    it("should delete tech tag successfully", async () => {
      mockPrisma.projectTag.findFirst.mockResolvedValue(null); // No project usage
      mockPrisma.archiveProjectTag.findFirst.mockResolvedValue(null); // No archive usage
      mockPrisma.techTag.delete.mockResolvedValue({});

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await deleteTechTag(mockRequest, {
        params: Promise.resolve({ id: techTagId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeNull();
      expect(data.message).toBe("Tech tag deleted successfully");
      expect(mockPrisma.techTag.delete).toHaveBeenCalledWith({
        where: { id: techTagId },
      });
    });

    it("should return conflict error when tag is in use", async () => {
      const projectUsage = { tagId: techTagId, projectId: "project-id" };

      mockPrisma.projectTag.findFirst.mockResolvedValue(projectUsage);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
      } as any;

      const response = await deleteTechTag(mockRequest, {
        params: Promise.resolve({ id: techTagId }),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Cannot delete tech tag. It is currently being used by projects or archive projects."
      );
    });
  });
});

describe("/api/tech-tags/bulk", () => {
  const user = generateTestUser();

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
});
