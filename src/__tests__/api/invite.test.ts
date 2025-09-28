import { POST } from "@/app/api/invite/route";
import {
  setupMocks,
  resetMocks,
  mockPrisma,
} from "../setup/mocks";
import {
  generateTestUser,
  generateTestPortfolio,
  createMockRequest,
} from "../utils/test-helpers";
import { faker } from "@faker-js/faker";
import { Role } from "@/types/enum";

// Setup mocks before importing modules
setupMocks();

describe("/api/invite", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("POST /api/invite", () => {
    const validInviteData = {
      email: faker.internet.email(),
      role: Role.EDITOR,
    };

    it("should send invitation successfully with valid data and permissions", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });

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
      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolio);
      mockPrisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
      mockPrisma.user.create.mockResolvedValue({
        id: faker.string.uuid(),
        email: validInviteData.email,
        name: "Invited User",
      });
      mockPrisma.userPortfolioRole.findFirst.mockResolvedValue(null); // No existing invitation
      mockPrisma.userPortfolioRole.create.mockResolvedValue({
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        portfolioId: portfolio.id,
        role: validInviteData.role,
        invitedAt: new Date(),
      });

      // Mock Resend
      const mockResend = {
        emails: {
          send: jest.fn().mockResolvedValue({ id: faker.string.uuid() }),
        },
      };
      jest.doMock("resend", () => ({
        Resend: jest.fn().mockImplementation(() => mockResend),
      }));

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validInviteData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Invitation sent successfully");
      expect(data.data.message).toContain(`Invitation sent to ${validInviteData.email}`);
      expect(data.data.note).toContain("sign up through the regular Kinde flow");
    });

    it("should update existing invitation when user already has role", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const existingUser = generateTestUser({ email: validInviteData.email });
      const existingInvitation = {
        id: faker.string.uuid(),
        userId: existingUser.id,
        portfolioId: portfolio.id,
        role: Role.VIEWER,
        invitedAt: new Date(),
      };

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
      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolio);
      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      mockPrisma.userPortfolioRole.findFirst.mockResolvedValue(existingInvitation);
      mockPrisma.userPortfolioRole.update.mockResolvedValue({
        ...existingInvitation,
        role: validInviteData.role,
      });

      // Mock Resend
      const mockResend = {
        emails: {
          send: jest.fn().mockResolvedValue({ id: faker.string.uuid() }),
        },
      };
      jest.doMock("resend", () => ({
        Resend: jest.fn().mockImplementation(() => mockResend),
      }));

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validInviteData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.userPortfolioRole.update).toHaveBeenCalledWith({
        where: { id: existingInvitation.id },
        data: {
          role: validInviteData.role,
          invitedAt: expect.any(Date),
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

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validInviteData),
      } as any;

      const response = await POST(request);

      expect(response!.status).toBe(401);
      expect(mockPrisma.portfolio.findFirst).not.toHaveBeenCalled();
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
        email: faker.internet.email(),
        // Missing role
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
      expect(data.error).toContain("Validation failed");
    });

    it("should return 404 when portfolio not found", async () => {
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

      mockPrisma.portfolio.findFirst.mockResolvedValue(null);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validInviteData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Portfolio not found");
    });

    it("should return 403 when user is not portfolio owner", async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: faker.internet.email() });

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

      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolio);

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validInviteData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Only the portfolio owner can invite users");
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

      mockPrisma.portfolio.findFirst.mockRejectedValue(new Error("Database error"));

      const request = {
        headers: {
          get: jest.fn().mockReturnValue("application/json"),
        },
        json: jest.fn().mockResolvedValue(validInviteData),
      } as any;

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });
});
