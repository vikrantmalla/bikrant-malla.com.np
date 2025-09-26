import { GET as getTechTags, POST as createTechTag } from '@/app/api/tech-tags/route';
import { GET as getTechTag, PUT as updateTechTag, DELETE as deleteTechTag } from '@/app/api/tech-tags/[id]/route';
import { POST as bulkCreateTechTags, DELETE as bulkDeleteTechTags } from '@/app/api/tech-tags/bulk/route';
import { setupMocks, resetMocks, mockPrisma, mockCustomAuth } from '../setup/mocks';
import { generateTestUser, generateTestTechTag, generateTestPortfolio } from '../utils/test-helpers';
import { faker } from '@faker-js/faker';

// Setup mocks before importing modules
setupMocks();

describe('/api/tech-tags', () => {
  beforeEach(() => {
    resetMocks();
    // Reset validation mock to default behavior
    const { validateRequest } = require('@/lib/validation');
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
          return { success: false, errors: new Error("Invalid ObjectId format") };
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

  describe('GET /api/tech-tags', () => {
    it('should return all tech tags successfully', async () => {
      const techTags = [
        generateTestTechTag({ tag: 'React' }),
        generateTestTechTag({ tag: 'TypeScript' }),
        generateTestTechTag({ tag: 'Next.js' }),
      ];

      mockPrisma.techTag.findMany.mockResolvedValue(techTags);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      } as any;

      const response = await getTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(techTags);
      expect(data.message).toBe('Tech tags retrieved successfully');
      expect(mockPrisma.techTag.findMany).toHaveBeenCalledWith({
        orderBy: {
          tag: 'asc',
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      mockPrisma.techTag.findMany.mockRejectedValue(new Error('Database connection failed'));

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      } as any;

      const response = await getTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Database connection failed');
    });
  });

  describe('POST /api/tech-tags', () => {
    const user = generateTestUser();
    const portfolio = generateTestPortfolio({ ownerEmail: user.email });

    beforeEach(() => {
      // Mock successful permission check
      const { checkEditorPermissions } = require('@/lib/roleUtils');
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

    it('should create a new tech tag successfully', async () => {
      const newTechTag = generateTestTechTag({ tag: 'Vue.js' });
      const requestBody = { tag: 'Vue.js' };

      mockPrisma.techTag.findFirst.mockResolvedValue(null); // No existing tag
      mockPrisma.techTag.create.mockResolvedValue(newTechTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(newTechTag);
      expect(data.message).toBe('Tech tag created successfully');
      expect(mockPrisma.techTag.create).toHaveBeenCalledWith({
        data: {
          tag: 'Vue.js',
        },
      });
    });

    it('should return conflict error when tag already exists', async () => {
      const existingTag = generateTestTechTag({ tag: 'React' });
      const requestBody = { tag: 'React' };

      mockPrisma.techTag.findFirst.mockResolvedValue(existingTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Tech tag already exists');
    });

    it('should return validation error for invalid input', async () => {
      const requestBody = { tag: '' }; // Invalid empty tag

      // Mock validation to fail
      const { validateRequest } = require('@/lib/validation');
      validateRequest.mockImplementation((_schema: any, data: { tag: string; }) => {
        if (data && typeof data === "object" && data.tag === "") {
          return { success: false, errors: new Error('Tag name is required') };
        }
        return { success: true, data };
      });

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return unauthorized error when permission check fails', async () => {
      const { checkEditorPermissions } = require('@/lib/roleUtils');
      checkEditorPermissions.mockResolvedValue({
        success: false,
        response: { json: () => ({ error: 'Unauthorized' }), status: 401 },
        user: null,
        kindeUser: null,
      });

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ tag: 'React' }),
      } as any;

      const response = await createTechTag(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});

describe('/api/tech-tags/[id]', () => {
  const techTagId = '68c6df05ad9309b10f79dcae'; // Valid ObjectId format
  const user = generateTestUser();

  describe('GET /api/tech-tags/[id]', () => {
    it('should return tech tag by ID successfully', async () => {
      const techTag = {
        ...generateTestTechTag({
          id: techTagId,
          tag: 'React',
        }),
        projectRelations: [],
        archiveProjectRelations: [],
      };

      mockPrisma.techTag.findUnique.mockResolvedValue(techTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      } as any;

      const response = await getTechTag(mockRequest, { params: Promise.resolve({ id: techTagId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(techTag);
      expect(data.message).toBe('Tech tag retrieved successfully');
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

    it('should return 404 when tech tag not found', async () => {
      mockPrisma.techTag.findUnique.mockResolvedValue(null);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      } as any;

      const response = await getTechTag(mockRequest, { params: Promise.resolve({ id: techTagId }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Tech tag not found');
    });

    it('should return validation error for invalid ObjectId', async () => {
      const invalidId = 'invalid-objectid';

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      } as any;

      const response = await getTechTag(mockRequest, { params: Promise.resolve({ id: invalidId }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('PUT /api/tech-tags/[id]', () => {
    beforeEach(() => {
      // Mock successful permission check
      const { checkEditorPermissions } = require('@/lib/roleUtils');
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

    it('should update tech tag successfully', async () => {
      const updatedTechTag = generateTestTechTag({ id: techTagId, tag: 'Vue.js' });
      const requestBody = { tag: 'Vue.js' };

      mockPrisma.techTag.findFirst.mockResolvedValue(null); // No conflicting tag
      mockPrisma.techTag.update.mockResolvedValue(updatedTechTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await updateTechTag(mockRequest, { params: Promise.resolve({ id: techTagId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(updatedTechTag);
      expect(data.message).toBe('Tech tag updated successfully');
      expect(mockPrisma.techTag.update).toHaveBeenCalledWith({
        where: { id: techTagId },
        data: { tag: 'Vue.js' },
      });
    });

    it('should return conflict error when tag name already exists', async () => {
      const existingTag = generateTestTechTag({ id: 'other-id', tag: 'Vue.js' });
      const requestBody = { tag: 'Vue.js' };

      mockPrisma.techTag.findFirst.mockResolvedValue(existingTag);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await updateTechTag(mockRequest, { params: Promise.resolve({ id: techTagId }) });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Tech tag with this name already exists');
    });
  });

  describe('DELETE /api/tech-tags/[id]', () => {
    beforeEach(() => {
      // Mock successful permission check
      const { checkEditorPermissions } = require('@/lib/roleUtils');
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

    it('should delete tech tag successfully', async () => {
      mockPrisma.projectTag.findFirst.mockResolvedValue(null); // No project usage
      mockPrisma.archiveProjectTag.findFirst.mockResolvedValue(null); // No archive usage
      mockPrisma.techTag.delete.mockResolvedValue({});

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      } as any;

      const response = await deleteTechTag(mockRequest, { params: Promise.resolve({ id: techTagId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeNull();
      expect(data.message).toBe('Tech tag deleted successfully');
      expect(mockPrisma.techTag.delete).toHaveBeenCalledWith({
        where: { id: techTagId },
      });
    });

    it('should return conflict error when tag is in use', async () => {
      const projectUsage = { tagId: techTagId, projectId: 'project-id' };

      mockPrisma.projectTag.findFirst.mockResolvedValue(projectUsage);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      } as any;

      const response = await deleteTechTag(mockRequest, { params: Promise.resolve({ id: techTagId }) });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        'Cannot delete tech tag. It is currently being used by projects or archive projects.'
      );
    });
  });
});

describe('/api/tech-tags/bulk', () => {
  const user = generateTestUser();

  beforeEach(() => {
    // Mock successful permission check
    const { checkEditorPermissions } = require('@/lib/roleUtils');
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

  describe('POST /api/tech-tags/bulk', () => {
    it('should create multiple tech tags successfully', async () => {
      const tags = ['Vue.js', 'Angular', 'Svelte'];
      const requestBody = { tags };
      const createdTags = tags.map(tag => generateTestTechTag({ tag }));

      // Mock no existing tags
      mockPrisma.techTag.findFirst.mockResolvedValue(null);
      // Mock successful creation for each tag
      mockPrisma.techTag.create
        .mockResolvedValueOnce(createdTags[0])
        .mockResolvedValueOnce(createdTags[1])
        .mockResolvedValueOnce(createdTags[2]);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await bulkCreateTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.created).toBe(3);
      expect(data.data.failed).toBe(0);
      expect(data.data.results).toHaveLength(3);
      expect(data.data.errors).toHaveLength(0);
      expect(data.message).toBe('Bulk operation completed');
    });

    it('should handle partial success with some tags already existing', async () => {
      const tags = ['Vue.js', 'React', 'Angular'];
      const requestBody = { tags };
      const existingTag = generateTestTechTag({ tag: 'React' });
      const newTags = [
        generateTestTechTag({ tag: 'Vue.js' }),
        generateTestTechTag({ tag: 'Angular' }),
      ];

      // Mock existing tag for 'React'
      mockPrisma.techTag.findFirst
        .mockResolvedValueOnce(null) // Vue.js - no existing
        .mockResolvedValueOnce(existingTag) // React - exists
        .mockResolvedValueOnce(null); // Angular - no existing

      // Mock successful creation for new tags
      mockPrisma.techTag.create
        .mockResolvedValueOnce(newTags[0])
        .mockResolvedValueOnce(newTags[1]);

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await bulkCreateTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(207); // Multi-Status
      expect(data.success).toBe(true);
      expect(data.data.created).toBe(2);
      expect(data.data.failed).toBe(1);
      expect(data.data.results).toHaveLength(2);
      expect(data.data.errors).toHaveLength(1);
      expect(data.data.errors[0].tag).toBe('React');
      expect(data.data.errors[0].error).toBe('Tag already exists');
    });

    it('should return validation error for invalid input', async () => {
      const requestBody = { tags: [] }; // Empty array

      // Mock validation to fail
      const { validateRequest } = require('@/lib/validation');
      validateRequest.mockImplementation((_schema: any, data: { tags: string | any[]; }) => {
        if (data && typeof data === "object" && data.tags && data.tags.length === 0) {
          return { success: false, errors: new Error('At least one tag is required') };
        }
        return { success: true, data };
      });

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await bulkCreateTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('DELETE /api/tech-tags/bulk', () => {
    it('should delete multiple tech tags successfully', async () => {
      const tagIds = ['68c6df05ad9309b10f79dcae', '68c6df05ad9309b10f79dcaf', '68c6df05ad9309b10f79dcb0']; // Valid ObjectId format
      const requestBody = { tagIds };

      // Mock no usage for any tags
      mockPrisma.projectTag.findFirst.mockResolvedValue(null);
      mockPrisma.archiveProjectTag.findFirst.mockResolvedValue(null);
      mockPrisma.techTag.delete.mockResolvedValue({});

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await bulkDeleteTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.deleted).toBe(3);
      expect(data.data.failed).toBe(0);
      expect(data.data.results).toHaveLength(3);
      expect(data.data.errors).toHaveLength(0);
      expect(data.message).toBe('Bulk deletion completed');
    });

    it('should handle partial success with some tags in use', async () => {
      const tagIds = ['68c6df05ad9309b10f79dcae', '68c6df05ad9309b10f79dcaf', '68c6df05ad9309b10f79dcb0']; // Valid ObjectId format
      const requestBody = { tagIds };
      const projectUsage = { tagId: tagIds[1], projectId: 'project-id' };

      // Mock usage for second tag
      mockPrisma.projectTag.findFirst
        .mockResolvedValueOnce(null) // First tag - no usage
        .mockResolvedValueOnce(projectUsage) // Second tag - in use
        .mockResolvedValueOnce(null); // Third tag - no usage

      mockPrisma.archiveProjectTag.findFirst.mockResolvedValue(null);
      mockPrisma.techTag.delete.mockResolvedValue({});

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await bulkDeleteTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(207); // Multi-Status
      expect(data.success).toBe(true);
      expect(data.data.deleted).toBe(2);
      expect(data.data.failed).toBe(1);
      expect(data.data.results).toHaveLength(2);
      expect(data.data.errors).toHaveLength(1);
      expect(data.data.errors[0].tagId).toBe(tagIds[1]);
      expect(data.data.errors[0].error).toBe(
        'Cannot delete tag. It is currently being used by projects or archive projects.'
      );
    });

    it('should return validation error for invalid input', async () => {
      const requestBody = { tagIds: ['invalid-objectid'] };

      // Mock validation to fail
      const { validateRequest } = require('@/lib/validation');
      validateRequest.mockImplementation((_schema: any, data: { tagIds: string | string[]; }) => {
        if (data && typeof data === "object" && data.tagIds && data.tagIds.includes('invalid-objectid')) {
          return { success: false, errors: new Error('Invalid ObjectId format') };
        }
        return { success: true, data };
      });

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(requestBody),
      } as any;

      const response = await bulkDeleteTechTags(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
