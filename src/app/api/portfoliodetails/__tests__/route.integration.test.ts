import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { GET } from '../route';
import * as Sentry from '@sentry/nextjs';
import AboutMe from '@/models/AboutMe';
import Behance from '@/models/Behance';
import Contact from '@/models/Contact';
import MetaTag from '@/models/MetaTag';
import Config from '@/models/Config';
import Projecthighlight from '@/models/ProjectHighlight';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
}));

jest.setTimeout(30000);

describe('Portfolio Details API Integration', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    try {
      mongoose.set('bufferTimeoutMS', 30000);
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      process.env.MONGODB_URI = uri;
      await mongoose.connect(uri);
      await mongoose.connection.asPromise();
      console.log('MongoDB connected:', mongoose.connection.readyState);
    } catch (error) {
      console.error('Failed to start MongoDB memory server:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.disconnect();
      await mongoServer.stop();
    } catch (error) {
      console.error('Failed to cleanup MongoDB memory server:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      if (mongoose.connection.readyState !== 1) {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is not defined');
        await mongoose.connect(uri);
      }
      // Clear all collections and wait for completion
      await Promise.all([
        AboutMe.deleteMany({}).exec(),
        Behance.deleteMany({}).exec(),
        Contact.deleteMany({}).exec(),
        MetaTag.deleteMany({}).exec(),
        Config.deleteMany({}).exec(),
        Projecthighlight.deleteMany({}).exec(),
      ]);
      // Verify collections are empty
      const counts = await Promise.all([
        AboutMe.countDocuments(),
        Behance.countDocuments(),
        Contact.countDocuments(),
        MetaTag.countDocuments(),
        Config.countDocuments(),
        Projecthighlight.countDocuments(),
      ]);
      if (counts.some(count => count > 0)) {
        throw new Error('Collections not cleared properly');
      }
    } catch (error) {
      console.error('Failed to clear collections:', error);
      throw error;
    }
  });

  it('should return empty data with real DB', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.aboutme).toEqual([]);
    expect(data.behance).toEqual([]);
    expect(data.contact).toEqual([]);
    expect(data.metaData).toEqual([]);
    expect(data.config).toEqual([]);
    expect(data.projecthighlight).toEqual([]);
  });

  it('should return seeded data correctly', async () => {
    await Promise.all([
      AboutMe.create({
        title: 'Test Title',
        subTitle: 'Test Subtitle',
        jobTitle: 'Test Job Title',
        aboutDescription1: 'Test Description 1',
        aboutDescription2: 'Test Description 2',
      }),
      Behance.create({
        title: 'Test Project',
        subTitle: 'Test Subtitle',
        projectview: 'https://behance.net/project',
        alt: 'Test Project Image',
        imageUrl: 'https://example.com/image.jpg',
        images: 'https://example.com/image1.jpg',
        description: 'Test Description',
      }),
      Contact.create({
        email: 'test@example.com',
        phone: '1234567890',
        address: 'Test Address',
        twitterUrl: 'https://twitter.com/test',
        linkedinUrl: 'https://linkedin.com/test',
        behanceUrl: 'https://behance.net/test',
        githubUrl: 'https://github.com/test',
        emailUrl: 'mailto:test@example.com',
        ctaMessage: 'Get in touch',
        message: 'Test message'
      }),
      MetaTag.create({
        title: 'Test Title',
        description: 'Test Description',
        keywords: ['test', 'keywords'],
        twitterID: 'test_twitter',
        fbID: 'test_facebook',
        author: 'Test Author',
        keyword: 'test,keywords'
      }),
      Config.create({
        setting: 'test',
        value: 'test value',
        allowBackupImages: true
      }),
      Projecthighlight.create({
        title: 'Test Project',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
        projectview: 'https://example.com/project',
        alt: 'Test Project Image',
        images: 'https://example.com/image1.jpg'
      }),
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.aboutme).toHaveLength(1);
    expect(data.aboutme[0]).toMatchObject({
      title: 'Test Title',
      subTitle: 'Test Subtitle',
    });
    expect(data.behance).toHaveLength(1);
    expect(data.contact).toHaveLength(1);
    expect(data.metaData).toHaveLength(1);
    expect(data.config).toHaveLength(1);
    expect(data.projecthighlight).toHaveLength(1);
  });

  it('should handle database connection error', async () => {
    await mongoose.disconnect();
    (mongoose as any).connection = { readyState: 0 };
    (Sentry.captureException as jest.Mock).mockClear();

    try {
      await GET();
    } catch (error) {
      expect(Sentry.captureException).toHaveBeenCalled();
    }
  });
});