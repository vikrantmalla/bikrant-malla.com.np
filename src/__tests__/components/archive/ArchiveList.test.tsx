import React from 'react';
import { render, screen } from '@testing-library/react';
import ArchiveList from '@/components/archive/ArchiveList';
import { useProjectStore } from '@/store/feature/projectStore';
import { createArchiveProjects, setFakerSeed, resetFakerSeed } from '@/__tests__/utils/testDataFactory';

// Mock the project store
jest.mock('@/store/feature/projectStore', () => ({
  useProjectStore: jest.fn(),
}));

const mockUseProjectStore = useProjectStore as jest.MockedFunction<typeof useProjectStore>;

// Generate test data with faker
let mockProjects: ReturnType<typeof createArchiveProjects>;

describe('ArchiveList', () => {
  beforeAll(() => {
    // Set consistent seed for predictable test data
    setFakerSeed(12345);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Generate fresh test data for each test
    mockProjects = createArchiveProjects(2);
  });

  afterAll(() => {
    // Reset faker seed for other tests
    resetFakerSeed();
  });

  it('renders projects when projectList has items', () => {
    mockUseProjectStore.mockReturnValue({
      projectList: mockProjects,
      showSkeletonLoading: false,
      selectedTag: 'All',
    } as any);

    render(<ArchiveList />);
    
    // Check that all generated project titles are rendered
    mockProjects.forEach(project => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
      expect(screen.getByText(project.year.toString())).toBeInTheDocument();
    });
  });

  it('renders no projects message when projectList is empty', () => {
    mockUseProjectStore.mockReturnValue({
      projectList: [],
      showSkeletonLoading: false,
      selectedTag: 'All',
    } as any);

    render(<ArchiveList />);
    
    expect(screen.getByText('No projects found for the selected filter')).toBeInTheDocument();
  });

  it('renders loading message when skeleton loading is true', () => {
    mockUseProjectStore.mockReturnValue({
      projectList: mockProjects,
      showSkeletonLoading: true,
      selectedTag: 'All',
    } as any);

    render(<ArchiveList />);
    
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    // Check that no project titles are rendered when loading
    mockProjects.forEach(project => {
      expect(screen.queryByText(project.title)).not.toBeInTheDocument();
    });
  });

  it('renders project tags correctly', () => {
    mockUseProjectStore.mockReturnValue({
      projectList: [mockProjects[0]], // Only first project
      showSkeletonLoading: false,
      selectedTag: 'All',
    } as any);

    render(<ArchiveList />);
    
    // Check that all tech stack items are rendered with correct test IDs
    mockProjects[0].build.forEach(tech => {
      expect(screen.getByTestId(`project-tag-${tech.toLowerCase().replace(/\s+/g, '-')}`)).toBeInTheDocument();
    });
  });

  it('renders project links correctly', () => {
    mockUseProjectStore.mockReturnValue({
      projectList: [mockProjects[0]], // Only first project
      showSkeletonLoading: false,
      selectedTag: 'All',
    } as any);

    render(<ArchiveList />);
    
    const links = screen.getAllByRole('link');
    const githubLink = links.find(link => link.getAttribute('href') === mockProjects[0].viewCode);
    const projectLink = links.find(link => link.getAttribute('href') === mockProjects[0].projectView);
    
    expect(githubLink).toBeInTheDocument();
    expect(projectLink).toBeInTheDocument();
  });

  it('applies correct CSS classes for new projects', () => {
    const newProject = { ...mockProjects[0], isNew: true };
    mockUseProjectStore.mockReturnValue({
      projectList: [newProject],
      showSkeletonLoading: false,
      selectedTag: 'All',
    } as any);

    render(<ArchiveList />);
    
    const projectElement = screen.getByText(newProject.title).closest('.project');
    expect(projectElement).toHaveClass('project', 'active');
  });

  it('applies correct CSS classes for non-new projects', () => {
    const nonNewProject = { ...mockProjects[0], isNew: false };
    
    mockUseProjectStore.mockReturnValue({
      projectList: [nonNewProject],
      showSkeletonLoading: false,
      selectedTag: 'All',
    } as any);

    render(<ArchiveList />);
    
    const projectElement = screen.getByText(nonNewProject.title).closest('.project');
    expect(projectElement).toHaveClass('project');
    expect(projectElement).not.toHaveClass('active');
  });
});
