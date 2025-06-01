import { GET } from '../route';
import { NextResponse } from 'next/server';
import dbConnect from '@/helpers/lib/dbConnect';
import AboutMe from '@/models/AboutMe';
import Behance from '@/models/Behance';
import Contact from '@/models/Contact';
import MetaTag from '@/models/MetaTag';
import Config from '@/models/Config';
import Projecthighlight from '@/models/ProjectHighlight';

// Mock the database connection and models
jest.mock('@/helpers/lib/dbConnect', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/models/AboutMe');
jest.mock('@/models/Behance');
jest.mock('@/models/Contact');
jest.mock('@/models/MetaTag');
jest.mock('@/models/Config');
jest.mock('@/models/ProjectHighlight');

describe('Portfolio Details API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return all portfolio data successfully', async () => {
    // Mock data
    const mockData = {
      aboutme: [{ id: 1, content: 'About me content' }],
      behance: [{ id: 1, url: 'https://behance.net' }],
      contact: [{ id: 1, email: 'test@example.com' }],
      metaData: [{ id: 1, title: 'Test Title' }],
      config: [{ id: 1, setting: 'test' }],
      projecthighlight: [{ id: 1, title: 'Test Project' }],
    };

    // Mock successful database connection
    (dbConnect as jest.Mock).mockResolvedValue(undefined);

    // Mock the find methods
    (AboutMe.find as jest.Mock).mockResolvedValue(mockData.aboutme);
    (Behance.find as jest.Mock).mockResolvedValue(mockData.behance);
    (Contact.find as jest.Mock).mockResolvedValue(mockData.contact);
    (MetaTag.find as jest.Mock).mockResolvedValue(mockData.metaData);
    (Config.find as jest.Mock).mockResolvedValue(mockData.config);
    (Projecthighlight.find as jest.Mock).mockResolvedValue(mockData.projecthighlight);

    // Call the API
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(data.success).toBe(true);
    expect(data.aboutme).toEqual(mockData.aboutme);
    expect(data.behance).toEqual(mockData.behance);
    expect(data.contact).toEqual(mockData.contact);
    expect(data.metaData).toEqual(mockData.metaData);
    expect(data.config).toEqual(mockData.config);
    expect(data.projecthighlight).toEqual(mockData.projecthighlight);
  });

  it('should handle database connection errors gracefully', async () => {
    // Mock database connection error
    (dbConnect as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    // Call the API
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Internal server error');
  });

  it('should handle model query errors gracefully', async () => {
    // Mock successful database connection
    (dbConnect as jest.Mock).mockResolvedValue(undefined);

    // Mock a model query error
    (AboutMe.find as jest.Mock).mockRejectedValue(new Error('Query failed'));

    // Call the API
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Internal server error');
  });
});