// Test helper utilities
import { faker } from '@faker-js/faker';
import { Platform, Role } from '@/types/enum';
import { User, Portfolio, Project, ArchiveProject, Config, TechTag, TechOption } from '@/types/data';

// Test data generators
export const generateTestUser = (overrides: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  kindeUserId: `kinde_${Date.now()}_${faker.string.alphanumeric(8)}`,
  email: faker.internet.email(),
  name: faker.person.fullName(),
  roles: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const generateTestPortfolio = (overrides: Partial<Portfolio> = {}): Portfolio => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  jobTitle: faker.person.jobTitle(),
  aboutDescription1: faker.lorem.paragraph(),
  aboutDescription2: faker.lorem.paragraph(),
  skills: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
  email: faker.internet.email(),
  ownerEmail: faker.internet.email(),
  linkedIn: faker.internet.url(),
  gitHub: faker.internet.url(),
  facebook: faker.internet.url(),
  instagram: faker.internet.url(),
  ...overrides,
});

export const generateTestProject = (portfolioId: string, overrides: Partial<Project> = {}): Project => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  subTitle: faker.lorem.sentence(),
  images: faker.image.url(),
  alt: faker.lorem.words(2),
  projectView: faker.internet.url(),
  tools: [faker.lorem.word(), faker.lorem.word()],
  platform: faker.helpers.enumValue(Platform) as "Web" | "Design",
  portfolioId,
  ...overrides,
});

export const generateTestConfig = (overrides: Partial<Config> = {}): Config => ({
  id: faker.string.uuid(),
  allowSignUp: true,
  ...overrides,
});

export const generateTestArchiveProject = (portfolioId: string, overrides: Partial<ArchiveProject> = {}): ArchiveProject => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  year: faker.date.past().getFullYear(),
  isNew: faker.datatype.boolean(),
  projectView: faker.internet.url(),
  viewCode: faker.internet.url(),
  build: [faker.lorem.word(), faker.lorem.word()],
  portfolioId,
  ...overrides,
});

export const generateTestTechTag = (overrides: Partial<TechTag> = {}): TechTag => ({
  id: faker.string.uuid(),
  tag: faker.lorem.word(),
  ...overrides,
});

export const generateTestTechOption = (overrides: Partial<TechOption> = {}): TechOption => ({
  id: faker.string.uuid(),
  name: faker.lorem.word(),
  category: faker.lorem.word(),
  ...overrides,
});

// Mock authentication helpers
export const mockAuthenticatedUser = (user: User) => {
  const mockGetUser = jest.fn().mockResolvedValue({
    id: user.kindeUserId,
    email: user.email,
    given_name: user.name?.split(' ')[0] || '',
    family_name: user.name?.split(' ')[1] || '',
  });

  return {
    getUser: mockGetUser,
    user: mockGetUser(),
  };
};

export const mockUnauthenticatedUser = () => {
  return {
    getUser: jest.fn().mockResolvedValue(null),
    user: null,
  };
};

// Mock permission helpers
export const mockEditorPermissions = (success: boolean, user?: User): void => {
  const { checkEditorPermissions } = require('@/lib/roleUtils');
  
  if (success && user) {
    checkEditorPermissions.mockResolvedValue({
      success: true,
      response: null,
      user,
      kindeUser: {
        id: user.kindeUserId,
        email: user.email,
        given_name: user.name?.split(' ')[0] || '',
        family_name: user.name?.split(' ')[1] || '',
      },
    });
  } else {
    checkEditorPermissions.mockResolvedValue({
      success: false,
      response: { json: () => ({ error: 'Unauthorized' }), status: 401 },
      user: null,
      kindeUser: null,
    });
  }
};

export const mockPortfolioAccess = (hasAccess: boolean, isOwner = false): void => {
  const { checkPortfolioAccess } = require('@/lib/roleUtils');
  
  checkPortfolioAccess.mockResolvedValue({
    isEditor: hasAccess && !isOwner,
    isOwner,
    hasAccess,
  });
};

// Request helpers
export const createMockRequest = (url: string, options: RequestInit = {}): Request => {
  return new Request(url, options);
};

export const createMockResponse = (data: any, status = 200) => {
  return {
    json: () => data,
    status,
  };
};
