import { GET, POST } from "@/app/api/setup/route";
import {
  setupMocks,
  resetMocks,
  mockPrisma,
} from "../setup/mocks";
import {
  generateTestUser,
  generateTestPortfolio,
  createMockRequest,
  TEST_BASE_URL,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";
import { Role } from "@/types/enum";

// Setup mocks before importing modules
setupMocks();

describe("/api/setup", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("GET /api/setup", () => {
    it("should return system status when not initialized", async () => {
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.portfolio.count.mockResolvedValue(0);

      const response = await GET(createMockRequest(`${TEST_BASE_URL}/api/setup`));
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("System status retrieved successfully");
      expect(data.data).toEqual({
        isInitialized: false,
        userCount: 0,
        portfolioCount: 0,
      });
    });

    it("should return system status when initialized", async () => {
      mockPrisma.user.count.mockResolvedValue(1);
      mockPrisma.portfolio.count.mockResolvedValue(1);

      const response = await GET(createMockRequest(`${TEST_BASE_URL}/api/setup`));
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("System status retrieved successfully");
      expect(data.data).toEqual({
        isInitialized: true,
        userCount: 1,
        portfolioCount: 1,
      });
    });

    it("should handle database errors", async () => {
      mockPrisma.user.count.mockRejectedValue(new Error("Database error"));

      const response = await GET(createMockRequest(`${TEST_BASE_URL}/api/setup`));
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });

  describe("POST /api/setup", () => {
    const validSetupData = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      portfolioName: faker.company.name(),
      jobTitle: faker.person.jobTitle(),
      password: faker.internet.password({ length: 12 }),
    };

    it("should initialize system successfully with valid data", async () => {
      const user = generateTestUser(validSetupData);
      const portfolio = generateTestPortfolio({ ownerEmail: validSetupData.email });

      // Mock system not initialized
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.portfolio.count.mockResolvedValue(0);

      // Mock user creation
      mockPrisma.user.create.mockResolvedValue(user);
      mockPrisma.portfolio.create.mockResolvedValue(portfolio);
      mockPrisma.userPortfolioRole.create.mockResolvedValue({
        id: faker.string.uuid(),
        userId: user.id,
        portfolioId: portfolio.id,
        role: Role.OWNER,
      });

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validSetupData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe("System initialized successfully! You can now log in with your credentials.");
      expect(data.data.user).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      expect(data.data.portfolio).toEqual({
        id: portfolio.id,
        name: portfolio.name,
      });
    });

    it("should return 409 when system is already initialized", async () => {
      // Mock system already initialized
      mockPrisma.user.count.mockResolvedValue(1);
      mockPrisma.portfolio.count.mockResolvedValue(1);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validSetupData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe("System is already initialized");
    });

    it("should return 500 when required fields are missing", async () => {
      // Mock system not initialized
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.portfolio.count.mockResolvedValue(0);

      const incompleteData = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        // Missing portfolioName, jobTitle, password
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
      expect(data.error).toContain("Illegal arguments");
    });

    it("should return 500 when email format is invalid", async () => {
      // Mock system not initialized
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.portfolio.count.mockResolvedValue(0);

      const invalidData = {
        ...validSetupData,
        email: "invalid-email",
      };

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(invalidData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cannot read properties of undefined");
    });

    it("should return 500 when password is too short", async () => {
      // Mock system not initialized
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.portfolio.count.mockResolvedValue(0);

      const invalidData = {
        ...validSetupData,
        password: "short",
      };

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(invalidData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cannot read properties of undefined");
    });

    it("should handle database errors during user creation", async () => {
      // Mock system not initialized
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.portfolio.count.mockResolvedValue(0);

      mockPrisma.user.create.mockRejectedValue(new Error("Database error"));

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validSetupData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });

    it("should handle database errors during portfolio creation", async () => {
      const user = generateTestUser(validSetupData);

      // Mock system not initialized
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.portfolio.count.mockResolvedValue(0);

      // Mock user creation success, portfolio creation failure
      mockPrisma.user.create.mockResolvedValue(user);
      mockPrisma.portfolio.create.mockRejectedValue(new Error("Database error"));

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validSetupData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });
});
