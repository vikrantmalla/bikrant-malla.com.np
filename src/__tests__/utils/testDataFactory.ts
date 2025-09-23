import { faker } from '@faker-js/faker';
import { ArchiveProject, TechTag, Project, Portfolio, User, UserPortfolioRole, ProjectTag, ArchiveProjectTag } from '@/types/data';

// Common tech stacks for realistic project data
const TECH_STACKS = {
  frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SCSS', 'Tailwind CSS'],
  backend: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel'],
  database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'SQLite', 'Firebase'],
  tools: ['Docker', 'Kubernetes', 'AWS', 'Vercel', 'Netlify', 'GitHub Actions', 'Jest', 'Cypress'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic'],
  design: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator']
};

// Common project categories
const PROJECT_CATEGORIES = ['Web Development', 'Mobile App', 'Design', 'Full Stack', 'Frontend', 'Backend', 'API', 'E-commerce', 'Portfolio', 'Blog'];

/**
 * Generate a random tech stack for projects
 */
function generateTechStack(): string[] {
  const stack: string[] = [];
  const categories = Object.keys(TECH_STACKS);
  
  // Pick 2-4 random categories
  const selectedCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 2, max: 4 }));
  
  selectedCategories.forEach(category => {
    const techs = TECH_STACKS[category as keyof typeof TECH_STACKS];
    const selectedTechs = faker.helpers.arrayElements(techs, faker.number.int({ min: 1, max: 3 }));
    stack.push(...selectedTechs);
  });
  
  return [...new Set(stack)]; // Remove duplicates
}

/**
 * Generate a realistic project title
 */
function generateProjectTitle(): string {
  const prefixes = ['Crypto', 'E-commerce', 'Social', 'Task', 'Blog', 'Portfolio', 'Dashboard', 'API', 'Mobile', 'Web'];
  const suffixes = ['App', 'Platform', 'System', 'Manager', 'Tracker', 'Hub', 'Portal', 'Marketplace', 'Network', 'Studio'];
  
  const prefix = faker.helpers.arrayElement(prefixes);
  const suffix = faker.helpers.arrayElement(suffixes);
  const middle = faker.helpers.maybe(() => faker.word.adjective(), { probability: 0.3 });
  
  return middle ? `${prefix} ${middle} ${suffix}` : `${prefix} ${suffix}`;
}

/**
 * Generate a realistic project subtitle/description
 */
function generateProjectSubtitle(): string {
  const templates = [
    'A modern {category} application built with {tech}',
    'An innovative {category} solution using {tech}',
    'A responsive {category} platform with {tech}',
    'A scalable {category} system powered by {tech}',
    'A user-friendly {category} application featuring {tech}'
  ];
  
  const template = faker.helpers.arrayElement(templates);
  const category = faker.helpers.arrayElement(PROJECT_CATEGORIES);
  const tech = faker.helpers.arrayElement(['React', 'Vue.js', 'Node.js', 'Python', 'TypeScript']);
  
  return template.replace('{category}', category).replace('{tech}', tech);
}

/**
 * Generate a realistic URL
 */
function generateUrl(type: 'github' | 'project' | 'portfolio'): string {
  const username = faker.internet.userName().toLowerCase();
  const projectName = faker.helpers.slugify(generateProjectTitle()).toLowerCase();
  
  switch (type) {
    case 'github':
      return `https://github.com/${username}/${projectName}`;
    case 'project':
      return `https://${projectName}.${faker.helpers.arrayElement(['netlify.app', 'vercel.app', 'github.io', 'herokuapp.com'])}`;
    case 'portfolio':
      return `https://${username}.${faker.helpers.arrayElement(['com', 'dev', 'io', 'net'])}`;
    default:
      return faker.internet.url();
  }
}

/**
 * Generate ArchiveProject data
 */
export function createArchiveProject(overrides: Partial<ArchiveProject> = {}): ArchiveProject {
  const techStack = generateTechStack();
  const year = faker.date.past({ years: 5 }).getFullYear();
  const isNew = faker.datatype.boolean({ probability: 0.3 });
  
  return {
    id: faker.string.uuid(),
    title: generateProjectTitle(),
    year,
    isNew,
    projectView: generateUrl('project'),
    viewCode: generateUrl('github'),
    build: techStack,
    portfolioId: faker.string.uuid(),
    ...overrides
  };
}

/**
 * Generate multiple ArchiveProject data
 */
export function createArchiveProjects(count: number, overrides: Partial<ArchiveProject> = {}): ArchiveProject[] {
  return Array.from({ length: count }, () => createArchiveProject(overrides));
}

/**
 * Generate TechTag data
 */
export function createTechTag(overrides: Partial<TechTag> = {}): TechTag {
  const techStack = generateTechStack();
  const tag = faker.helpers.arrayElement(techStack);
  
  return {
    id: faker.string.uuid(),
    tag,
    ...overrides
  };
}

/**
 * Generate multiple TechTag data
 */
export function createTechTags(count: number, overrides: Partial<TechTag> = {}): TechTag[] {
  return Array.from({ length: count }, () => createTechTag(overrides));
}

/**
 * Generate Project data
 */
export function createProject(overrides: Partial<Project> = {}): Project {
  const techStack = generateTechStack();
  const platform = faker.helpers.arrayElement(['Web', 'Design'] as const);
  
  return {
    id: faker.string.uuid(),
    title: generateProjectTitle(),
    subTitle: generateProjectSubtitle(),
    images: faker.image.url({ width: 800, height: 600 }),
    alt: faker.lorem.sentence(3),
    projectView: generateUrl('project'),
    tools: techStack,
    platform,
    portfolioId: faker.string.uuid(),
    ...overrides
  };
}

/**
 * Generate multiple Project data
 */
export function createProjects(count: number, overrides: Partial<Project> = {}): Project[] {
  return Array.from({ length: count }, () => createProject(overrides));
}

/**
 * Generate User data
 */
export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    roles: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    emailVerified: faker.datatype.boolean({ probability: 0.8 }),
    ...overrides
  };
}

/**
 * Generate Portfolio data
 */
export function createPortfolio(overrides: Partial<Portfolio> = {}): Portfolio {
  const skills = generateTechStack().slice(0, faker.number.int({ min: 3, max: 8 }));
  
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    jobTitle: faker.person.jobTitle(),
    aboutDescription1: faker.lorem.paragraph(),
    aboutDescription2: faker.lorem.paragraph(),
    skills,
    email: faker.internet.email(),
    ownerEmail: faker.internet.email(),
    linkedIn: faker.internet.url(),
    gitHub: generateUrl('github'),
    behance: faker.internet.url(),
    twitter: faker.internet.url(),
    ...overrides
  };
}

/**
 * Generate UserPortfolioRole data
 */
export function createUserPortfolioRole(overrides: Partial<UserPortfolioRole> = {}): UserPortfolioRole {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    portfolioId: faker.string.uuid(),
    role: faker.helpers.arrayElement(['OWNER', 'EDITOR', 'VIEWER'] as const),
    invitedAt: faker.date.past(),
    ...overrides
  };
}

/**
 * Generate ProjectTag data
 */
export function createProjectTag(overrides: Partial<ProjectTag> = {}): ProjectTag {
  return {
    id: faker.string.uuid(),
    projectId: faker.string.uuid(),
    tagId: faker.string.uuid(),
    ...overrides
  };
}

/**
 * Generate ArchiveProjectTag data
 */
export function createArchiveProjectTag(overrides: Partial<ArchiveProjectTag> = {}): ArchiveProjectTag {
  return {
    id: faker.string.uuid(),
    archiveProjectId: faker.string.uuid(),
    tagId: faker.string.uuid(),
    ...overrides
  };
}

/**
 * Generate mock store data for testing
 */
export function createMockProjectStore() {
  return {
    projectList: createArchiveProjects(5),
    originalProjects: createArchiveProjects(5),
    selectedTag: faker.helpers.arrayElement(['All', 'React', 'CSS', 'HTML', 'Feature']),
    showSkeletonLoading: faker.datatype.boolean(),
    isAscending: faker.datatype.boolean(),
    setSelectedTag: jest.fn(),
    setProjectList: jest.fn(),
    setOriginalProjects: jest.fn(),
    sortProjectList: jest.fn(),
    setSkeletonLoading: jest.fn(),
  };
}

/**
 * Generate mock tech tags for testing
 */
export function createMockTechTags(): TechTag[] {
  return [
    { id: '1', tag: 'All' },
    { id: '2', tag: 'React' },
    { id: '3', tag: 'CSS' },
    { id: '4', tag: 'HTML' },
    { id: '5', tag: 'Feature' },
    { id: '6', tag: 'JavaScript' },
    { id: '7', tag: 'TypeScript' },
    { id: '8', tag: 'Node.js' },
  ];
}

/**
 * Set faker seed for consistent test data
 */
export function setFakerSeed(seed: number = 12345): void {
  faker.seed(seed);
}

/**
 * Reset faker to use random seed
 */
export function resetFakerSeed(): void {
  faker.seed();
}
