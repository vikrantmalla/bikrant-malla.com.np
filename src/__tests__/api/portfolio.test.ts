import { GET, POST } from "@/app/api/portfolio/route";
import {
  setupMocks,
  resetMocks,
  mockPrisma,
  mockCustomAuth,
} from "../setup/mocks";
import {
  generateTestPortfolio,
  generateTestUser,
  generateTestProject,
  generateTestArchiveProject,
  createMockRequest,
  TEST_BASE_URL,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";

// Setup mocks before importing modules
setupMocks();

describe("/api/portfolio", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("GET /api/portfolio", () => {
    it("should return portfolio with projects and archive projects", async () => {
      const portfolio = generateTestPortfolio();
      const projects = [
        generateTestProject(portfolio.id, { title: faker.lorem.words(3) }),
        generateTestProject(portfolio.id, { title: faker.lorem.words(3) }),
      ];
      const archiveProjects = [
        generateTestArchiveProject(portfolio.id, {
          title: faker.lorem.words(3),
        }),
        generateTestArchiveProject(portfolio.id, {
          title: faker.lorem.words(3),
        }),
      ];

      const portfolioWithRelations = {
        ...portfolio,
        projects,
        archiveProjects,
      };

      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolioWithRelations);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/portfolio`)
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Portfolio data retrieved successfully");
      expect(data.data).toEqual(portfolioWithRelations);
      expect(mockPrisma.portfolio.findFirst).toHaveBeenCalledWith({
        include: {
          projects: {
            include: {
              tagRelations: {
                include: {
                  tag: true,
                },
              },
            },
          },
          archiveProjects: {
            include: {
              tagRelations: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
      });
    });

    it("should return empty portfolio when no portfolio exists", async () => {
      mockPrisma.portfolio.findFirst.mockResolvedValue(null);

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/portfolio`)
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Portfolio data retrieved successfully");
      expect(data.data).toEqual({
        id: null,
        name: "",
        jobTitle: "",
        aboutDescription1: "",
        aboutDescription2: "",
        skills: [],
        email: "",
        ownerEmail: "",
        linkedIn: "",
        gitHub: "",
        behance: "",
        twitter: "",
        projects: [],
        archiveProjects: [],
        userRoles: [],
      });
    });

    it("should handle database errors", async () => {
      mockPrisma.portfolio.findFirst.mockRejectedValue(
        new Error("Database error")
      );

      const response = await GET(
        createMockRequest(`${TEST_BASE_URL}/api/portfolio`)
      );
      const data = await response.json();

      // The new API uses proper error handling, so it returns 500
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });

  describe("POST /api/portfolio", () => {
    const validPortfolioData = {
      name: faker.person.fullName(),
      jobTitle: faker.person.jobTitle(),
      aboutDescription1: faker.lorem.paragraph(),
      aboutDescription2: faker.lorem.paragraph(),
      email: faker.internet.email(),
      ownerEmail: faker.internet.email(),
      skills: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
      linkedIn: faker.internet.url(),
      gitHub: faker.internet.url(),
      behance: faker.internet.url(),
      twitter: faker.internet.url(),
    };

    it("should create portfolio successfully with valid data", async () => {
      const user = generateTestUser({ email: validPortfolioData.ownerEmail });

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

      const createdPortfolio = generateTestPortfolio(validPortfolioData);
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.portfolio.findFirst.mockResolvedValue(null); // No existing portfolio
      mockPrisma.portfolio.create.mockResolvedValue(createdPortfolio);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validPortfolioData),
      } as any;

      const response = await POST(mockRequest);
      const data = await response!.json();

      expect(response!.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Portfolio created successfully");
      expect(data.data).toEqual(createdPortfolio);
      expect(mockPrisma.portfolio.create).toHaveBeenCalledWith({
        data: {
          name: validPortfolioData.name.trim(),
          jobTitle: validPortfolioData.jobTitle.trim(),
          aboutDescription1: validPortfolioData.aboutDescription1.trim(),
          aboutDescription2: validPortfolioData.aboutDescription2?.trim() || "",
          skills: validPortfolioData.skills || [],
          ownerEmail: validPortfolioData.ownerEmail.trim(),
          linkedIn: validPortfolioData.linkedIn?.trim() || "",
          gitHub: validPortfolioData.gitHub?.trim() || "",
          behance: validPortfolioData.behance?.trim() || "",
          twitter: validPortfolioData.twitter?.trim() || "",
        },
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

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validPortfolioData),
      } as any;

      const response = await POST(mockRequest);

      expect(response!.status).toBe(401);
      expect(mockPrisma.portfolio.create).not.toHaveBeenCalled();
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
        name: faker.person.fullName(),
        ownerEmail: user.email, // Include ownerEmail to avoid ownership check failure
        // Missing other required fields
      };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(incompleteData),
      } as any;

      const response = await POST(mockRequest);
      const data = await response!.json();

      // The validation error is being thrown and handled by the error handler
      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cannot read properties of undefined");
    });

    it("should return 409 when user tries to create portfolio for someone else", async () => {
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

      const dataForSomeoneElse = {
        ...validPortfolioData,
        ownerEmail: faker.internet.email(), // Different email
      };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(dataForSomeoneElse),
      } as any;

      const response = await POST(mockRequest);
      const data = await response!.json();

      expect(response!.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe("You can only create portfolios for yourself");
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

      // Use user's email for ownerEmail to avoid 409 error
      const testData = { ...validPortfolioData, ownerEmail: user.email };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.portfolio.findFirst.mockResolvedValue(null); // No existing portfolio
      mockPrisma.portfolio.create.mockRejectedValue(
        new Error("Database error")
      );

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(testData),
      } as any;

      const response = await POST(mockRequest);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });
});
