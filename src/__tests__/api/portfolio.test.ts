import { GET } from '@/app/api/portfolio/route';
import { POST } from '@/app/api/portfolio/create/route';
import { setupMocks, resetMocks, mockPrisma, mockCustomAuth } from '../setup/mocks';
import { generateTestPortfolio, generateTestUser, generateTestProject, generateTestArchiveProject, createMockRequest } from '../utils/test-helpers';
import { faker } from '@faker-js/faker';

// Setup mocks before importing modules
setupMocks();

describe('/api/portfolio', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('GET /api/portfolio', () => {
    it('should return portfolio with projects and archive projects', async () => {
      const portfolio = generateTestPortfolio();
      const projects = [
        generateTestProject(portfolio.id, { title: faker.lorem.words(3) }),
        generateTestProject(portfolio.id, { title: faker.lorem.words(3) })
      ];
      const archiveProjects = [
        generateTestArchiveProject(portfolio.id, { title: faker.lorem.words(3) }),
        generateTestArchiveProject(portfolio.id, { title: faker.lorem.words(3) })
      ];
      
      const portfolioWithRelations = {
        ...portfolio,
        projects,
        archiveProjects,
      };

      mockPrisma.portfolio.findFirst.mockResolvedValue(portfolioWithRelations);

      const response = await GET(new Request('http://localhost:3000/api/portfolio'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(portfolioWithRelations);
      expect(mockPrisma.portfolio.findFirst).toHaveBeenCalledWith({
        include: {
          projects: true,
          archiveProjects: true,
        },
      });
    });

    it('should return empty portfolio when no portfolio exists', async () => {
      mockPrisma.portfolio.findFirst.mockResolvedValue(null);

      const response = await GET(new Request('http://localhost:3000/api/portfolio'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: null,
        name: '',
        jobTitle: '',
        aboutDescription1: '',
        aboutDescription2: '',
        skills: [],
        email: '',
        ownerEmail: '',
        linkedIn: '',
        gitHub: '',
        facebook: '',
        instagram: '',
        projects: [],
        archiveProjects: [],
        userRoles: []
      });
    });

    it('should handle database errors', async () => {
      mockPrisma.portfolio.findFirst.mockRejectedValue(new Error('Database error'));

      const response = await GET(new Request('http://localhost:3000/api/portfolio'));
      const data = await response.json();

      // The actual implementation returns empty portfolio structure on error, not 500
      expect(response.status).toBe(200);
      expect(data).toEqual({
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
        facebook: "",
        instagram: "",
        projects: [],
        archiveProjects: [],
        userRoles: []
      });
    });
  });

  describe('POST /api/portfolio/create', () => {
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
      facebook: faker.internet.url(),
      instagram: faker.internet.url(),
    };

    it('should create portfolio successfully with valid data', async () => {
      const user = generateTestUser({ email: validPortfolioData.ownerEmail });
      
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

      const createdPortfolio = generateTestPortfolio(validPortfolioData);
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.portfolio.create.mockResolvedValue(createdPortfolio);

      const request = createMockRequest('http://localhost:3000/api/portfolio/create', {
        method: 'POST',
        body: JSON.stringify(validPortfolioData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(201);
      expect(data.message).toBe('Portfolio created successfully');
      expect(data.portfolio).toEqual(createdPortfolio);
      expect(mockPrisma.portfolio.create).toHaveBeenCalledWith({
        data: {
          name: validPortfolioData.name,
          jobTitle: validPortfolioData.jobTitle,
          aboutDescription1: validPortfolioData.aboutDescription1,
          aboutDescription2: validPortfolioData.aboutDescription2,
          skills: validPortfolioData.skills || [],
          ownerEmail: validPortfolioData.ownerEmail,
          linkedIn: validPortfolioData.linkedIn,
          gitHub: validPortfolioData.gitHub,
          facebook: validPortfolioData.facebook,
          instagram: validPortfolioData.instagram,
        },
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

      const request = createMockRequest('http://localhost:3000/api/portfolio/create', {
        method: 'POST',
        body: JSON.stringify(validPortfolioData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);

      expect(response!.status).toBe(401);
      expect(mockPrisma.portfolio.create).not.toHaveBeenCalled();
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
        name: faker.person.fullName(),
        // Missing required fields
      };

      const request = createMockRequest('http://localhost:3000/api/portfolio/create', {
        method: 'POST',
        body: JSON.stringify(incompleteData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(400);
      expect(data.error).toBe('jobTitle is required');
    });

    it('should return 403 when user tries to create portfolio for someone else', async () => {
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

      const dataForSomeoneElse = {
        ...validPortfolioData,
        ownerEmail: faker.internet.email(), // Different email
      };

      const request = createMockRequest('http://localhost:3000/api/portfolio/create', {
        method: 'POST',
        body: JSON.stringify(dataForSomeoneElse),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(403);
      expect(data.error).toBe('You can only create portfolios for yourself');
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

      // Use user's email for ownerEmail to avoid 403 error
      const testData = { ...validPortfolioData, ownerEmail: user.email };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.portfolio.create.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest('http://localhost:3000/api/portfolio/create', {
        method: 'POST',
        body: JSON.stringify(testData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response!.json();

      expect(response!.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
