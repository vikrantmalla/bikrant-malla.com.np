import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import ArchiveFilterMenu from '@/components/archive/ArchiveFilterMenu';
import { useProjectStore } from '@/store/feature/projectStore';
import { TagsCategory } from '@/types/enum';
import { createTechTags, createArchiveProjects, createMockProjectStore, setFakerSeed, resetFakerSeed, createArchiveProject, createTechTag } from '@/__tests__/utils/testDataFactory';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock the project store
jest.mock('@/store/feature/projectStore', () => ({
  useProjectStore: jest.fn(),
}));

// Mock Google Analytics
jest.mock('@/helpers/lib/gtag', () => ({
  event: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseProjectStore = useProjectStore as jest.MockedFunction<typeof useProjectStore>;

// Generate test data with faker
let mockTechTags: ReturnType<typeof createTechTags>;
let mockProjects: ReturnType<typeof createArchiveProjects>;

describe('ArchiveFilterMenu', () => {
  const mockSetSelectedTag = jest.fn();
  const mockSetProjectList = jest.fn();
  const mockSetSkeletonLoading = jest.fn();
  const mockSortProjectList = jest.fn();

  beforeAll(() => {
    // Set consistent seed for predictable test data
    setFakerSeed(12345);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Generate fresh test data for each test
    mockTechTags = [
      createTechTag({ tag: 'All' }),
      createTechTag({ tag: 'CSS' }),
      createTechTag({ tag: 'Feature' }),
      createTechTag({ tag: 'HTML' }),
      createTechTag({ tag: 'React JS' }),
    ];
    
    mockProjects = createArchiveProjects(2);
    
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('All'),
    } as any);

    mockUseProjectStore.mockReturnValue({
      projectList: mockProjects,
      originalProjects: mockProjects,
      selectedTag: 'All',
      showSkeletonLoading: false,
      isAscending: false,
      setSelectedTag: mockSetSelectedTag,
      setProjectList: mockSetProjectList,
      setSkeletonLoading: mockSetSkeletonLoading,
      sortProjectList: mockSortProjectList,
    });
  });

  afterAll(() => {
    // Reset faker seed for other tests
    resetFakerSeed();
  });

  it('renders all filter buttons correctly', () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('React JS')).toBeInTheDocument();
  });

  it('shows correct project count for selected tag', () => {
    mockUseProjectStore.mockReturnValue({
      projectList: [mockProjects[0]], // Only CryptoMarket
      originalProjects: mockProjects,
      selectedTag: 'React JS',
      showSkeletonLoading: false,
      isAscending: false,
      setSelectedTag: mockSetSelectedTag,
      setProjectList: mockSetProjectList,
      setSkeletonLoading: mockSetSkeletonLoading,
      sortProjectList: mockSortProjectList,
    });

    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    expect(screen.getByText('React JS')).toBeInTheDocument();
    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('handles React JS filter click correctly', async () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const reactJSButton = screen.getByText('React JS');
    fireEvent.click(reactJSButton);
    
    await waitFor(() => {
      expect(mockSetSelectedTag).toHaveBeenCalledWith('React JS');
      expect(mockSetSkeletonLoading).toHaveBeenCalledWith(true);
    });
  });

  it('handles CSS filter click correctly', async () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const cssButton = screen.getByText('CSS');
    fireEvent.click(cssButton);
    
    await waitFor(() => {
      expect(mockSetSelectedTag).toHaveBeenCalledWith('CSS');
      expect(mockSetSkeletonLoading).toHaveBeenCalledWith(true);
    });
  });

  it('handles All filter click correctly', async () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const allButton = screen.getByText('All');
    fireEvent.click(allButton);
    
    await waitFor(() => {
      expect(mockSetSelectedTag).toHaveBeenCalledWith('All');
      expect(mockSetSkeletonLoading).toHaveBeenCalledWith(true);
    });
  });

  it('handles Feature filter click correctly', async () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const featureButton = screen.getByText('Feature');
    fireEvent.click(featureButton);
    
    await waitFor(() => {
      expect(mockSetSelectedTag).toHaveBeenCalledWith('Feature');
      expect(mockSetSkeletonLoading).toHaveBeenCalledWith(true);
    });
  });

  it('handles HTML filter click correctly', async () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const htmlButton = screen.getByText('HTML');
    fireEvent.click(htmlButton);
    
    await waitFor(() => {
      expect(mockSetSelectedTag).toHaveBeenCalledWith('HTML');
      expect(mockSetSkeletonLoading).toHaveBeenCalledWith(true);
    });
  });

  it('applies correct CSS class for selected tag', () => {
    mockUseProjectStore.mockReturnValue({
      projectList: mockProjects,
      originalProjects: mockProjects,
      selectedTag: 'React JS',
      showSkeletonLoading: false,
      isAscending: false,
      setSelectedTag: mockSetSelectedTag,
      setProjectList: mockSetProjectList,
      setSkeletonLoading: mockSetSkeletonLoading,
      sortProjectList: mockSortProjectList,
    });

    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const reactJSButton = screen.getByText('React JS').closest('a');
    expect(reactJSButton).toHaveClass('tag-selected');
    
    const cssButton = screen.getByText('CSS').closest('a');
    expect(cssButton).toHaveClass('tag-not-selected');
  });

  it('handles sort button click correctly', () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const sortButton = screen.getByRole('button', { name: /sort/i });
    fireEvent.click(sortButton);
    
    expect(mockSortProjectList).toHaveBeenCalled();
  });

  it('generates correct URLs for filter links', () => {
    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    const allLink = screen.getByText('All').closest('a');
    expect(allLink).toHaveAttribute('href', '/archive');
    
    const cssLink = screen.getByText('CSS').closest('a');
    expect(cssLink).toHaveAttribute('href', '/archive?tag=css');
    
    const reactJSLink = screen.getByText('React JS').closest('a');
    expect(reactJSLink).toHaveAttribute('href', '/archive?tag=react_js');
  });

  it('handles URL parameter changes correctly', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('react_js'),
    } as any);

    mockUseProjectStore.mockReturnValue({
      projectList: [mockProjects[0]],
      originalProjects: mockProjects,
      selectedTag: 'react_js',
      showSkeletonLoading: false,
      isAscending: false,
      setSelectedTag: mockSetSelectedTag,
      setProjectList: mockSetProjectList,
      setSkeletonLoading: mockSetSkeletonLoading,
      sortProjectList: mockSortProjectList,
    });

    render(<ArchiveFilterMenu techTag={mockTechTags} />);
    
    // Should show React JS as selected
    const reactJSButton = screen.getByText('React JS').closest('a');
    expect(reactJSButton).toHaveClass('tag-selected');
  });

  // Faker-powered tests
  describe('with faker-generated data', () => {
    it('renders with random tech tags', () => {
      const randomTechTags = createTechTags(8);
      render(<ArchiveFilterMenu techTag={randomTechTags} />);
      
      // Check that all generated tags are rendered
      randomTechTags.forEach(tag => {
        expect(screen.getByText(tag.tag)).toBeInTheDocument();
      });
    });

    it('handles different project counts correctly', () => {
      const manyProjects = createArchiveProjects(10);
      const fewProjects = createArchiveProjects(2);
      
      // Test with many projects
      mockUseProjectStore.mockReturnValue({
        projectList: manyProjects,
        originalProjects: manyProjects,
        selectedTag: 'All',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
      });

      const { rerender } = render(<ArchiveFilterMenu techTag={mockTechTags} />);
      
      // Should show count for many projects
      const allButton = screen.getByText('All').closest('a');
      expect(allButton).toHaveTextContent('(10)');

      // Test with few projects
      mockUseProjectStore.mockReturnValue({
        projectList: fewProjects,
        originalProjects: fewProjects,
        selectedTag: 'All',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
      });

      rerender(<ArchiveFilterMenu techTag={mockTechTags} />);
      
      // Should show count for few projects
      const allButtonFew = screen.getByText('All').closest('a');
      expect(allButtonFew).toHaveTextContent('(2)');
    });

    it('handles various tech tag formats correctly', () => {
      const customTechTags = [
        createTechTag({ tag: 'All' }),
        createTechTag({ tag: 'React Native' }),
        createTechTag({ tag: 'Node.js' }),
        createTechTag({ tag: 'TypeScript' }),
        createTechTag({ tag: 'MongoDB' }),
      ];
      
      render(<ArchiveFilterMenu techTag={customTechTags} />);
      
      // Check that all custom tags are rendered
      customTechTags.forEach(tag => {
        expect(screen.getByText(tag.tag)).toBeInTheDocument();
      });
      
      // Check that URLs are generated correctly for different tag formats
      const reactNativeLink = screen.getByText('React Native').closest('a');
      expect(reactNativeLink).toHaveAttribute('href', '/archive?tag=react_native');
      
      const nodejsLink = screen.getByText('Node.js').closest('a');
      expect(nodejsLink).toHaveAttribute('href', '/archive?tag=node.js');
    });

    it('handles empty project lists gracefully', () => {
      mockUseProjectStore.mockReturnValue({
        projectList: [],
        originalProjects: [],
        selectedTag: 'All',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
      });

      render(<ArchiveFilterMenu techTag={mockTechTags} />);
      
      // Should still render all filter buttons
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('CSS')).toBeInTheDocument();
      
      // Should show 0 count for empty list
      const allButton = screen.getByText('All').closest('a');
      expect(allButton).toHaveTextContent('(0)');
    });
  });
});
