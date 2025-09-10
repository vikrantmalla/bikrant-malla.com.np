import { GET } from '@/app/api/projects/route';
import { POST } from '@/app/api/projects/create/route';
import { setupMocks, resetMocks, mockPrisma, mockCustomAuth } from '../setup/mocks';
import { generateTestUser, generateTestPortfolio, generateTestProject, createMockRequest } from '../utils/test-helpers';
import { faker } from '@faker-js/faker';

// Setup mocks before importing modules
setupMocks();

describe('/api/projects', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('GET /api/projects', () => {
    it('should return projects for authenticated user with portfolio access', async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const projects = [
        generateTestProject(portfolio.id),
        generateTestProject(portfolio.id),
      ];

      // Mock roleUtils
      const { checkEditorPermissions } = require('@/lib/roleUtils');
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

      const response = await GET(new Request('http://localhost:3000/api/projects'));
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(data.message).toBe('Projects retrieved successfully');
      expect(data.projects).toEqual(projects);
      expect(data.portfolio).toEqual({
        id: portfolio.id,
        name: portfolio.name,
      });
    });

    it('should create user if they do not exist in database', async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio({ ownerEmail: user.email });
      const projects: never[] = [];

      // Mock roleUtils
      const { checkEditorPermissions } = require('@/lib/roleUtils');
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

      const response = await GET(new Request('http://localhost:3000/api/projects'));
      const data = await response!.json();

      expect(response!.status).toBe(200);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: user.email,
          password: expect.any(String),
          name: user.name || user.email.split('@')[0],
          isActive: true,
          emailVerified: false,
        },
        include: { roles: true },
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock roleUtils
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: { json: () => ({ error: 'Unauthorized' }), status: 401 },
        user: null,
      });

      const response = await GET(new Request('http://localhost:3000/api/projects'));

      expect(response!.status).toBe(401);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 404 when no portfolio is found for user', async () => {
      const user = generateTestUser();

      // Mock roleUtils
      const { checkEditorPermissions } = require('@/lib/roleUtils');
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

      const response = await GET(new Request('http://localhost:3000/api/projects'));
      const data = await response!.json();

      expect(response!.status).toBe(404);
      expect(data.error).toBe('No portfolio found for user');
    });

    it('should handle database errors', async () => {
      const user = generateTestUser();

      // Mock roleUtils
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      checkEditorPermissions.mockResolvedValue({
        success: true,
        response: null,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });

      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await GET(new Request('http://localhost:3000/api/projects'));
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/projects/create', () => {
    const validProjectData = {
      title: faker.lorem.words(3),
      subTitle: faker.lorem.sentence(),
      images: faker.image.url(),
      alt: faker.lorem.words(2),
      projectView: faker.internet.url(),
      tools: [faker.lorem.word(), faker.lorem.word()],
      platform: 'Web' as const,
      portfolioId: faker.string.uuid(),
    };

    it('should create project successfully with valid data and permissions', async () => {
      const user = generateTestUser();
      const portfolio = generateTestPortfolio();
      const config = { maxWebProjects: 6, maxDesignProjects: 6, maxTotalProjects: 12 };

      // Mock roleUtils
      const { checkEditorPermissions, checkPortfolioAccess } = require('@/lib/roleUtils');
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

      const createdProject = generateTestProject(validProjectData.portfolioId, validProjectData);
      
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.config.findFirst.mockResolvedValue(config);
      mockPrisma.project.findMany.mockResolvedValue([]); // No existing projects
      mockPrisma.project.create.mockResolvedValue(createdProject);

      const request = createMockRequest('http://localhost:3000/api/projects/create', {
        method: 'POST',
        body: JSON.stringify(validProjectData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(201);
      expect(data.message).toBe('Project created successfully');
      expect(data.project).toEqual(createdProject);
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock roleUtils
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: { json: () => ({ error: 'Unauthorized' }), status: 401 },
        user: null,
      });

      const request = createMockRequest('http://localhost:3000/api/projects/create', {
        method: 'POST',
        body: JSON.stringify(validProjectData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response!.status).toBe(401);
      expect(mockPrisma.project.create).not.toHaveBeenCalled();
    });

    it('should return 400 when required fields are missing', async () => {
      const user = generateTestUser();
      
      // Mock roleUtils
      const { checkEditorPermissions } = require('@/lib/roleUtils');
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

      const request = createMockRequest('http://localhost:3000/api/projects/create', {
        method: 'POST',
        body: JSON.stringify(incompleteData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(400);
      expect(data.error).toBe('projectView is required');
    });

    it('should return 403 when user does not have portfolio access', async () => {
      const user = generateTestUser();
      
      // Mock roleUtils
      const { checkEditorPermissions, checkPortfolioAccess } = require('@/lib/roleUtils');
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

      const request = createMockRequest('http://localhost:3000/api/projects/create', {
        method: 'POST',
        body: JSON.stringify(validProjectData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(403);
      expect(data.error).toContain('Access denied');
    });

    it('should return 400 when project limit is reached', async () => {
      const user = generateTestUser();
      const config = { maxWebProjects: 1, maxDesignProjects: 6, maxTotalProjects: 1 };
      const existingProjects = [generateTestProject(faker.string.uuid())]; // Already at limit

      // Mock roleUtils
      const { checkEditorPermissions, checkPortfolioAccess } = require('@/lib/roleUtils');
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

      const request = createMockRequest('http://localhost:3000/api/projects/create', {
        method: 'POST',
        body: JSON.stringify(validProjectData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(400);
      expect(data.error).toContain('Maximum total projects limit reached');
    });

    it('should handle database errors', async () => {
      const user = generateTestUser();
      
      // Mock roleUtils
      const { checkEditorPermissions, checkPortfolioAccess } = require('@/lib/roleUtils');
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
      mockPrisma.config.findFirst.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest('http://localhost:3000/api/projects/create', {
        method: 'POST',
        body: JSON.stringify(validProjectData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
