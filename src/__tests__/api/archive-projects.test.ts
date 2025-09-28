import { GET, POST } from "@/app/api/archive-projects/route";
import {
  GET as GET_BY_ID,
  PUT,
  DELETE,
} from "@/app/api/archive-projects/[id]/route";
import {
  setupMocks,
  resetMocks,
  mockPrisma,
  mockCustomAuth,
} from "../setup/mocks";
import {
  generateTestUser,
  generateTestPortfolio,
  generateTestArchiveProject,
  createMockRequest,
  TEST_BASE_URL,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";

// Setup mocks before importing modules
setupMocks();

describe("/api/archive-projects", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("GET /api/archive-projects", () => {
    it("should return archive projects for authenticated user with portfolio access", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const archiveProjects = [
        generateTestArchiveProject(portfolio.id),
        generateTestArchiveProject(portfolio.id),
      ];

      // Mock roleUtils
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

      // Mock database calls
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.portfolio.findMany.mockResolvedValue([portfolio]);
      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolio);
      mockPrisma.archiveProject.findMany.mockResolvedValue(archiveProjects);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/archive-projects`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Archive projects retrieved successfully");
      expect(data.data.archiveProjects).toEqual(archiveProjects);
      expect(data.data.portfolio).toEqual({
        id: portfolio.id,
        name: portfolio.name,
      });
    });

    it("should create user if they do not exist in database", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const archiveProjects: never[] = [];

      // Mock roleUtils
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

      // Mock user not found initially, then created
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValue(user);
      mockPrisma.portfolio.findMany.mockResolvedValue([portfolio]);
      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolio);
      mockPrisma.archiveProject.findMany.mockResolvedValue(archiveProjects);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/archive-projects`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: user.email,
          password: expect.any(String),
          name: user.name || user.email.split("@")[0],
          isActive: true,
          emailVerified: false,
        },
        include: { roles: true },
      });
    });

    it("should return 401 when user is not authenticated", async () => {
      // Mock roleUtils
      const { checkEditorPermissions } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: { json: () => ({ error: "Unauthorized" }), status: 401 },
        user: null,
      });

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/archive-projects`)
      );

      expect(response!.status).toBe(401);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return 404 when no portfolio is found for user", async () => {
      const user = generateTestUser();

      // Mock roleUtils
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

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.portfolio.findMany.mockResolvedValue([]);
      mockPrisma.portfolio.findFirst.mockResolvedValue(null);
      mockPrisma.userPortfolioRole.findFirst.mockResolvedValue(null);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/archive-projects`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("No portfolio found for user");
    });

    it("should handle database errors", async () => {
      const user = generateTestUser();

      // Mock roleUtils
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

      mockPrisma.user.findUnique.mockRejectedValue(new Error("Database error"));

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/archive-projects`)
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });

  describe("POST /api/archive-projects", () => {
    const validArchiveProjectData = {
      title: faker.lorem.words(3),
      year: faker.date.past().getFullYear(),
      isNew: faker.datatype.boolean(),
      projectView: faker.internet.url(),
      viewCode: faker.internet.url(),
      build: [faker.lorem.word(), faker.lorem.word()],
      portfolioId: faker.string.uuid(),
    };

    it("should create archive project successfully with valid data and permissions", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio();

      // Mock roleUtils
      const {
        checkEditorPermissions,
        checkPortfolioAccess,
      } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      checkPortfolioAccess.mockResolvedValue({
        hasAccess: true,
        isEditor: true,
        isOwner: false,
      });

      const createdArchiveProject = generateTestArchiveProject(
        validArchiveProjectData.portfolioId,
        validArchiveProjectData
      );

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.archiveProject.create.mockResolvedValue(createdArchiveProject);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validArchiveProjectData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Archive project created successfully");
      expect(data.data).toEqual(createdArchiveProject);
    });

    it("should return 401 when user is not authenticated", async () => {
      // Mock roleUtils
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
        json: jest.fn().mockResolvedValue(validArchiveProjectData),
      } as any;

      const response = await POST(request);

      expect(response!.status).toBe(401);
      expect(mockPrisma.archiveProject.create).not.toHaveBeenCalled();
    });

    it("should return 500 when required fields are missing", async () => {
      const user = generateTestUser();

      // Mock roleUtils
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

      const incompleteData = {
        title: faker.lorem.words(3),
        // Missing required fields: year, projectView, build, portfolioId
      };

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(incompleteData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cannot read properties of undefined");
    });

    it("should return 403 when user does not have portfolio access", async () => {
      const user = generateTestUser();

      // Mock roleUtils
      const {
        checkEditorPermissions,
        checkPortfolioAccess,
      } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      checkPortfolioAccess.mockResolvedValue({
        hasAccess: false,
        isEditor: false,
        isOwner: false,
      });

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validArchiveProjectData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Access denied");
    });

    it("should handle database errors", async () => {
      const user = generateTestUser();

      // Mock roleUtils
      const {
        checkEditorPermissions,
        checkPortfolioAccess,
      } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      checkPortfolioAccess.mockResolvedValue({
        hasAccess: true,
        isEditor: true,
        isOwner: false,
      });

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.archiveProject.create.mockRejectedValue(
        new Error("Database error")
      );

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validArchiveProjectData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });

  describe("GET /api/archive-projects/[id]", () => {
    it("should return archive project by ID", async () => {
      const archiveProject = generateTestArchiveProject(faker.string.uuid());

      mockPrisma.archiveProject.findUnique.mockResolvedValue(archiveProject);

      const response = await GET_BY_ID(
        createMockRequest(
          `${TEST_BASE_URL}/api/archive-projects/507f1f77bcf86cd799439011`
        ),
        { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Archive project retrieved successfully");
      expect(data.data).toEqual(archiveProject);
    });

    it("should return 404 when archive project not found", async () => {
      mockPrisma.archiveProject.findUnique.mockResolvedValue(null);

      const response = await GET_BY_ID(
        createMockRequest(
          `${TEST_BASE_URL}/api/archive-projects/507f1f77bcf86cd799439011`
        ),
        { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
      );
      const data = await response!.json();

      expect(response!.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Archive project not found");
    });

    it("should return 404 for invalid archive project ID format", async () => {
      const response = await GET_BY_ID(
        createMockRequest(
          `${TEST_BASE_URL}/api/archive-projects/invalid-id`
        ),
        { params: Promise.resolve({ id: "invalid-id" }) }
      );
      const data = await response!.json();

      expect(response!.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid archive project ID format");
    });
  });

  describe("PUT /api/archive-projects/[id]", () => {
    const validUpdateData = {
      title: faker.lorem.words(3),
      year: faker.date.past().getFullYear(),
      isNew: faker.datatype.boolean(),
      projectView: faker.internet.url(),
      viewCode: faker.internet.url(),
      build: [faker.lorem.word(), faker.lorem.word()],
    };

    it("should update archive project successfully with valid data and permissions", async () => {
      const user = generateTestUser();
      const archiveProject = generateTestArchiveProject(faker.string.uuid());
      const updatedArchiveProject = { ...archiveProject, ...validUpdateData };

      // Mock roleUtils
      const {
        checkEditorPermissions,
        checkProjectAccess,
      } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      checkProjectAccess.mockResolvedValue({
        hasAccess: true,
        isEditor: true,
        isOwner: false,
      });

      mockPrisma.archiveProject.update.mockResolvedValue(updatedArchiveProject);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validUpdateData),
      } as any;

      const response = await PUT(request, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Archive project updated successfully");
      expect(data.data).toEqual(updatedArchiveProject);
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
        json: jest.fn().mockResolvedValue(validUpdateData),
      } as any;

      const response = await PUT(request, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });

      expect(response!.status).toBe(401);
      expect(mockPrisma.archiveProject.update).not.toHaveBeenCalled();
    });

    it("should return 403 when user does not have project access", async () => {
      const user = generateTestUser();

      const {
        checkEditorPermissions,
        checkProjectAccess,
      } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      checkProjectAccess.mockResolvedValue({
        hasAccess: false,
        isEditor: false,
        isOwner: false,
      });

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validUpdateData),
      } as any;

      const response = await PUT(request, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response!.json();

      expect(response!.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Access denied");
    });
  });

  describe("DELETE /api/archive-projects/[id]", () => {
    it("should delete archive project successfully with valid permissions", async () => {
      const user = generateTestUser();
      const archiveProject = generateTestArchiveProject(faker.string.uuid());

      // Mock roleUtils
      const {
        checkEditorPermissions,
        checkProjectAccess,
      } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      checkProjectAccess.mockResolvedValue({
        hasAccess: true,
        isEditor: true,
        isOwner: false,
      });

      mockPrisma.archiveProjectTag.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.archiveProject.delete.mockResolvedValue(archiveProject);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue({}),
      } as any;

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Archive project deleted successfully");
      expect(mockPrisma.archiveProjectTag.deleteMany).toHaveBeenCalledWith({
        where: { archiveProjectId: "507f1f77bcf86cd799439011" },
      });
      expect(mockPrisma.archiveProject.delete).toHaveBeenCalledWith({
        where: { id: "507f1f77bcf86cd799439011" },
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
        json: jest.fn().mockResolvedValue({}),
      } as any;

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });

      expect(response!.status).toBe(401);
      expect(mockPrisma.archiveProject.delete).not.toHaveBeenCalled();
    });

    it("should return 403 when user does not have project access", async () => {
      const user = generateTestUser();

      const {
        checkEditorPermissions,
        checkProjectAccess,
      } = require("@/lib/roleUtils");
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      checkProjectAccess.mockResolvedValue({
        hasAccess: false,
        isEditor: false,
        isOwner: false,
      });

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue({}),
      } as any;

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }),
      });
      const data = await response!.json();

      expect(response!.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Access denied");
    });
  });
});
