# API Testing Guide

This guide explains how to run API integration tests for your Next.js application.

## Quick Start - Running Individual Tests

### Method 1: Run specific test file
```bash
npm test -- simple-config.test.ts
npm test -- config.test.ts
npm test -- projects.test.ts
```

### Method 2: Run with full path
```bash
npm test -- src/__tests__/api/simple-config.test.ts
npm test -- src/__tests__/api/config.test.ts
```

### Method 3: Run with test name pattern
```bash
npm test -- --testNamePattern="config"
npm test -- --testNamePattern="projects"
```

### Method 4: Run API tests only
```bash
npm run test:api
npm run test:api -- simple-config.test.ts
```

## Available Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only API tests
npm run test:api

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci

# Run specific test file
npm test -- filename.test.ts
```

## Test Files Available

- `simple-config.test.ts` - ✅ Working simple config test
- `config.test.ts` - Full config API tests
- `projects.test.ts` - Projects API tests
- `portfolio.test.ts` - Portfolio API tests
- `tech-tags.test.ts` - Tech tags API tests
- `tech-options.test.ts` - Tech options API tests
- `archive-projects.test.ts` - Archive projects API tests
- `invite.test.ts` - Invite API tests

## Test Structure

```
src/__tests__/
├── setup/
│   ├── simple-test-setup.ts    # ✅ Working test setup
│   ├── test-setup.ts           # Original test setup
│   ├── global-setup.ts         # Global setup (disabled)
│   └── global-teardown.ts      # Global teardown (disabled)
├── utils/
│   └── test-utils.ts           # Test utilities
└── api/
    ├── simple-config.test.ts   # ✅ Working example
    ├── config.test.ts          # Full config tests
    ├── projects.test.ts        # Projects tests
    ├── portfolio.test.ts       # Portfolio tests
    ├── tech-tags.test.ts       # Tech tags tests
    ├── tech-options.test.ts    # Tech options tests
    ├── archive-projects.test.ts # Archive projects tests
    └── invite.test.ts          # Invite tests
```

## Working Test Example

The `simple-config.test.ts` file demonstrates a working test setup:

```typescript
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/config/route';
import { setupTestDatabase, teardownTestDatabase, cleanupDatabase } from '../setup/simple-test-setup';

describe('Simple Config API Test', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('should return default config when no config exists', async () => {
    const request = new NextRequest('http://localhost:3000/api/config');
    const response = await GET();
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toMatchObject({
      maxWebProjects: 6,
      maxDesignProjects: 6,
      maxTotalProjects: 12,
    });
    expect(data.id).toBeDefined();
  });
});
```

## Test Environment

- **MongoDB Memory Server**: In-memory MongoDB for testing
- **Jest**: Testing framework
- **Prisma**: Database ORM with test database
- **Faker.js**: Test data generation

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: The MongoDB Memory Server might take time to start
2. **Prisma Client Issues**: Make sure the test database URL is set correctly
3. **Test Timeouts**: Increase timeout in jest.config.js if needed

### Debug Mode

Run tests with verbose output:
```bash
npm test -- --verbose
```

### Force Exit

If tests hang, use:
```bash
npm test -- --forceExit
```

## Next Steps

1. **Start with working tests**: Use `simple-config.test.ts` as a template
2. **Fix database issues**: The cleanup function needs to be updated for MongoDB
3. **Add more tests**: Create tests for other API endpoints
4. **Mock external services**: Add mocks for email services, etc.

## Current Status

- ✅ Basic test setup working
- ✅ Individual test file execution working
- ⚠️ Database cleanup needs fixing
- ⚠️ Some API tests need database setup fixes
- ⚠️ Authentication mocking needs improvement

## Recommended Approach

1. Start with `simple-config.test.ts` - it's working
2. Fix the database cleanup issues
3. Gradually add more comprehensive tests
4. Use the working patterns from the simple test
