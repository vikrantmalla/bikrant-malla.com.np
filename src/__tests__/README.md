# API Testing Documentation

This directory contains comprehensive API tests for the bikrant-malla.com.np application.

## Test Structure

```
src/__tests__/
├── api/                    # API endpoint tests
│   ├── auth.test.ts       # Authentication API tests
│   ├── config.test.ts     # Configuration API tests
│   ├── portfolio.test.ts  # Portfolio API tests
│   └── projects.test.ts   # Projects API tests
├── setup/                 # Test setup and configuration
│   ├── mocks.ts          # Mock implementations
│   └── jest.setup.ts     # Jest configuration
└── utils/                 # Test utilities
    └── test-helpers.ts   # Helper functions and data generators
```

## Test Coverage

### API Endpoints Tested

1. **Config API** (`/api/config`)
   - GET: Retrieve configuration
   - PUT: Update configuration (requires authentication)

2. **Portfolio API** (`/api/portfolio`)
   - GET: Retrieve portfolio data
   - POST: Create new portfolio (requires authentication)

3. **Projects API** (`/api/projects`)
   - GET: Retrieve user's projects (requires authentication)
   - POST: Create new project (requires authentication)

4. **Auth API** (`/api/auth/check-role`)
   - GET: Check user role and permissions (requires authentication)

## Test Features

### Mocking Strategy
- **Prisma Client**: All database operations are mocked
- **Kinde Authentication**: Authentication flows are mocked
- **Next.js Modules**: Request/Response objects are mocked
- **Role Utilities**: Permission checking is mocked

### Test Data Generation
- Uses Faker.js for generating realistic test data
- Provides helper functions for creating test users, portfolios, projects, etc.
- Supports custom overrides for specific test scenarios

### Authentication Testing
- Tests both authenticated and unauthenticated scenarios
- Validates permission-based access control
- Tests role-based authorization (owner, editor, etc.)

### Error Handling
- Tests database connection errors
- Tests validation errors
- Tests authorization failures
- Tests internal server errors

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- config.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Examples

### Basic API Test
```typescript
it('should return data successfully', async () => {
  // Setup mocks
  mockPrisma.model.findMany.mockResolvedValue(mockData);
  
  // Make request
  const response = await GET();
  const data = await response.json();
  
  // Assertions
  expect(response.status).toBe(200);
  expect(data).toEqual(mockData);
});
```

### Authentication Test
```typescript
it('should require authentication', async () => {
  // Mock unauthenticated user
  mockKindeAuth.getKindeServerSession.mockReturnValue({
    getUser: jest.fn().mockResolvedValue(null),
  });
  
  const response = await GET();
  
  expect(response.status).toBe(401);
});
```

### Permission Test
```typescript
it('should check user permissions', async () => {
  // Mock user with editor permissions
  const { checkEditorPermissions } = require('@/lib/roleUtils');
  checkEditorPermissions.mockResolvedValue({
    success: true,
    user: mockUser,
    kindeUser: mockKindeUser,
  });
  
  const response = await POST(request);
  
  expect(response.status).toBe(201);
});
```

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: All external dependencies are properly mocked
3. **Data Generation**: Use Faker.js for realistic test data
4. **Error Scenarios**: Test both success and failure cases
5. **Authentication**: Test both authenticated and unauthenticated flows
6. **Permissions**: Test role-based access control

