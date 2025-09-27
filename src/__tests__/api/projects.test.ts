import { GET, POST } from "@/app/api/projects/route";
import { GET as GET_BY_ID, PUT, DELETE } from "@/app/api/projects/[id]/route";
import {
  setupMocks,
  resetMocks,
  mockPrisma,
  mockCustomAuth,
} from "../setup/mocks";
import {
  generateTestUser,
  generateTestPortfolio,
  generateTestProject,
  createMockRequest,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";

// Setup mocks before importing modules
setupMocks();

describe("/api/projects", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("GET /api/projects", () => {
    it("should return projects for authenticated user with portfolio access", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const projects = [
        generateTestProject(portfolio.id),
        generateTestProject(portfolio.id),
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
      mockPrisma.project.findMany.mockResolvedValue(projects);

      const response = await GET(
        createMockRequest("http://localhost:3000/api/projects")
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Projects retrieved successfully");
      expect(data.data.projects).toEqual(projects);
      expect(data.data.portfolio).toEqual({
        id: portfolio.id,
        name: portfolio.name,
      });
    });

    it("should create user if they do not exist in database", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const projects: never[] = [];

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
      mockPrisma.project.findMany.mockResolvedValue(projects);

      const response = await GET(
        createMockRequest("http://localhost:3000/api/projects")
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
        createMockRequest("http://localhost:3000/api/projects")
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
        createMockRequest("http://localhost:3000/api/projects")
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
        createMockRequest("http://localhost:3000/api/projects")
      );
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });

  describe("POST /api/projects", () => {
    const validProjectData = {
      title: faker.lorem.words(3),
      subTitle: faker.lorem.sentence(),
      images: faker.image.url(),
      alt: faker.lorem.words(2),
      projectView: faker.internet.url(),
      tools: [faker.lorem.word(), faker.lorem.word()],
      platform: "Web" as const,
      portfolioId: faker.string.uuid(),
    };

    it("should create project successfully with valid data and permissions", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio();
      const config = {
        maxWebProjects: 6,
        maxDesignProjects: 6,
        maxTotalProjects: 12,
      };

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

      const createdProject = generateTestProject(
        validProjectData.portfolioId,
        validProjectData
      );

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.config.findFirst.mockResolvedValue(config);
      mockPrisma.project.findMany.mockResolvedValue([]); // No existing projects
      mockPrisma.project.create.mockResolvedValue(createdProject);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validProjectData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Project created successfully");
      expect(data.data).toEqual(createdProject);
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
        json: jest.fn().mockResolvedValue(validProjectData),
      } as any;

      const response = await POST(request);

      expect(response!.status).toBe(401);
      expect(mockPrisma.project.create).not.toHaveBeenCalled();
    });

    it("should return 400 when required fields are missing", async () => {
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
        // Missing required fields: projectView, tools, portfolioId
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
        json: jest.fn().mockResolvedValue(validProjectData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Access denied");
    });

    it("should return 400 when project limit is reached", async () => {
      const user = generateTestUser();
      const config = {
        maxWebProjects: 1,
        maxDesignProjects: 6,
        maxTotalProjects: 1,
      };
      const existingProjects = [generateTestProject(faker.string.uuid())]; // Already at limit

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
      mockPrisma.config.findFirst.mockResolvedValue(config);
      mockPrisma.project.findMany.mockResolvedValue(existingProjects);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validProjectData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Maximum total projects limit reached");
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
      mockPrisma.config.findFirst.mockRejectedValue(
        new Error("Database error")
      );

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validProjectData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });

  describe("GET /api/projects/[id]", () => {
    it("should return project by ID", async () => {
      const project = generateTestProject(faker.string.uuid());

      mockPrisma.project.findUnique.mockResolvedValue(project);

      const response = await GET_BY_ID(
        createMockRequest(
          "http://localhost:3000/api/projects/507f1f77bcf86cd799439011"
        ),
        { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
      );
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Project retrieved successfully");
      expect(data.data).toEqual(project);
    });

    it("should return 404 when project not found", async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      const response = await GET_BY_ID(
        createMockRequest(
          "http://localhost:3000/api/projects/507f1f77bcf86cd799439011"
        ),
        { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
      );
      const data = await response!.json();

      expect(response!.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Project not found");
    });

    it("should return 400 for invalid project ID format", async () => {
      const response = await GET_BY_ID(
        createMockRequest("http://localhost:3000/api/projects/invalid-id"),
        { params: Promise.resolve({ id: "invalid-id" }) }
      );
      const data = await response!.json();

      expect(response!.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid project ID format");
    });
  });

  describe("PUT /api/projects/[id]", () => {
    const validUpdateData = {
      title: faker.lorem.words(3),
      subTitle: faker.lorem.sentence(),
      images: faker.image.url(),
      alt: faker.lorem.words(2),
      projectView: faker.internet.url(),
      tools: [faker.lorem.word(), faker.lorem.word()],
      platform: "Web" as const,
    };

    it("should update project successfully with valid data and permissions", async () => {
      const user = generateTestUser();
      const project = generateTestProject(faker.string.uuid());
      const updatedProject = { ...project, ...validUpdateData };

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

      mockPrisma.project.update.mockResolvedValue(updatedProject);

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
      expect(data.message).toBe("Project updated successfully");
      expect(data.data).toEqual(updatedProject);
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
      expect(mockPrisma.project.update).not.toHaveBeenCalled();
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

  describe("DELETE /api/projects/[id]", () => {
    it("should delete project successfully with valid permissions", async () => {
      const user = generateTestUser();
      const project = generateTestProject(faker.string.uuid());

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

      mockPrisma.projectTag.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.project.delete.mockResolvedValue(project);

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
      expect(data.message).toBe("Project deleted successfully");
      expect(mockPrisma.projectTag.deleteMany).toHaveBeenCalledWith({
        where: { projectId: "507f1f77bcf86cd799439011" },
      });
      expect(mockPrisma.project.delete).toHaveBeenCalledWith({
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
      expect(mockPrisma.project.delete).not.toHaveBeenCalled();
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
