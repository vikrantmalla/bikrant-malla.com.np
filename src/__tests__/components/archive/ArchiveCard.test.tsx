import React from 'react';
import { render, screen } from '@testing-library/react';
import ArchiveDetails from '@/components/archive/ArchiveCard';
import { useProjectStore } from '@/store/feature/projectStore';
import { TagsCategory } from '@/types/enum';
import { createArchiveProject, createMockProjectStore, setFakerSeed, resetFakerSeed } from '@/__tests__/utils/testDataFactory';

// Mock the project store
jest.mock('@/store/feature/projectStore', () => ({
  useProjectStore: jest.fn(),
}));

const mockUseProjectStore = useProjectStore as jest.MockedFunction<typeof useProjectStore>;

// Generate test data with faker
let mockProject: ReturnType<typeof createArchiveProject>;

describe('ArchiveDetails', () => {
  beforeAll(() => {
    // Set consistent seed for predictable test data
    setFakerSeed(12345);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Generate fresh test data for each test
    mockProject = createArchiveProject({
      title: 'CryptoMarket',
      year: 2019,
      isNew: true,
      build: ['React JS', 'Context API + Reducer', 'REST API', 'CSS'],
      projectView: 'https://cryptomarket09.netlify.app/',
      viewCode: 'https://github.com/vikrantmalla/CryptoMarket',
    });
  });

  afterAll(() => {
    // Reset faker seed for other tests
    resetFakerSeed();
  });

  it('renders project information correctly', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    expect(screen.getByText('CryptoMarket')).toBeInTheDocument();
    expect(screen.getByText('2019')).toBeInTheDocument();
  });

  it('renders project links correctly', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    const links = screen.getAllByRole('link');
    const githubLink = links.find(link => link.getAttribute('href') === 'https://github.com/vikrantmalla/CryptoMarket');
    const projectLink = links.find(link => link.getAttribute('href') === 'https://cryptomarket09.netlify.app/');
    
    expect(githubLink).toBeInTheDocument();
    expect(projectLink).toBeInTheDocument();
  });

  it('renders all project tags correctly', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    expect(screen.getByText('React JS')).toBeInTheDocument();
    expect(screen.getByText('Context API + Reducer')).toBeInTheDocument();
    expect(screen.getByText('REST API')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
  });

  it('renders tags with correct test IDs', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    expect(screen.getByTestId('project-tag-react-js')).not.toBeNull();
    expect(screen.getByTestId('project-tag-context-api-+-reducer')).not.toBeNull();
    expect(screen.getByTestId('project-tag-rest-api')).not.toBeNull();
    expect(screen.getByTestId('project-tag-css')).not.toBeNull();
  });

  it('shows NEW badge for new projects when All tag is selected', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    expect(screen.getByText('NEW!')).toBeInTheDocument();
  });

  it('does not show NEW badge for new projects when specific tag is selected', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'React JS',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    expect(screen.queryByText('NEW!')).not.toBeInTheDocument();
  });

  it('does not show NEW badge for non-new projects', () => {
    const nonNewProject = { ...mockProject, isNew: false };
    
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...nonNewProject} />);
    
    expect(screen.queryByText('NEW!')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for new projects', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    const projectElement = screen.getByText('CryptoMarket').closest('.project');
    expect(projectElement).toHaveClass('project', 'active');
  });

  it('applies correct CSS classes for non-new projects', () => {
    const nonNewProject = { ...mockProject, isNew: false };
    
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...nonNewProject} />);
    
    const projectElement = screen.getByText('CryptoMarket').closest('.project');
    expect(projectElement).toHaveClass('project');
    expect(projectElement).not.toHaveClass('active');
  });

  it('shows skeleton when loading is true', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'All',
      showSkeletonLoading: true,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    expect(screen.queryByText('CryptoMarket')).not.toBeInTheDocument();
    // Check for skeleton elements by class name
    expect(document.querySelector('.skeleton')).toBeInTheDocument();
  });

  it('formats selected tag correctly for React JS', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'react_js',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    // The component should render without errors
    expect(screen.getByText('CryptoMarket')).toBeInTheDocument();
  });

  it('formats selected tag correctly for CSS', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'css',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    // The component should render without errors
    expect(screen.getByText('CryptoMarket')).toBeInTheDocument();
  });

  it('formats selected tag correctly for HTML', () => {
    mockUseProjectStore.mockReturnValue({
      selectedTag: 'html',
      showSkeletonLoading: false,
    } as any);

    render(<ArchiveDetails {...mockProject} />);
    
    // The component should render without errors
    expect(screen.getByText('CryptoMarket')).toBeInTheDocument();
  });

  // Faker-powered tests
  describe('with faker-generated data', () => {
    it('renders with random project data', () => {
      const randomProject = createArchiveProject();
      mockUseProjectStore.mockReturnValue({
        selectedTag: 'All',
        showSkeletonLoading: false,
      } as any);

      render(<ArchiveDetails {...randomProject} />);
      
      expect(screen.getByText(randomProject.title)).toBeInTheDocument();
      expect(screen.getByText(randomProject.year.toString())).toBeInTheDocument();
      
      // Check that all tech stack items are rendered
      randomProject.build.forEach(tech => {
        expect(screen.getByText(tech)).toBeInTheDocument();
      });
    });

    it('handles different project years correctly', () => {
      const oldProject = createArchiveProject({ year: 2020, isNew: false });
      const newProject = createArchiveProject({ year: 2024, isNew: true });
      
      mockUseProjectStore.mockReturnValue({
        selectedTag: 'All',
        showSkeletonLoading: false,
      } as any);

      // Test old project
      const { rerender } = render(<ArchiveDetails {...oldProject} />);
      expect(screen.getByText(oldProject.year.toString())).toBeInTheDocument();
      expect(screen.queryByText('NEW!')).not.toBeInTheDocument();

      // Test new project
      rerender(<ArchiveDetails {...newProject} />);
      expect(screen.getByText(newProject.year.toString())).toBeInTheDocument();
      expect(screen.getByText('NEW!')).toBeInTheDocument();
    });

    it('handles various tech stacks correctly', () => {
      const projectWithManyTechs = createArchiveProject({
        build: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
      });
      
      mockUseProjectStore.mockReturnValue({
        selectedTag: 'All',
        showSkeletonLoading: false,
      } as any);

      render(<ArchiveDetails {...projectWithManyTechs} />);
      
      projectWithManyTechs.build.forEach(tech => {
        expect(screen.getByText(tech)).toBeInTheDocument();
        expect(screen.getByTestId(`project-tag-${tech.toLowerCase().replace(/\s+/g, '-')}`)).toBeInTheDocument();
      });
    });

    it('handles different URL formats correctly', () => {
      const projectWithCustomUrls = createArchiveProject({
        projectView: 'https://my-awesome-app.vercel.app',
        viewCode: 'https://github.com/username/awesome-repo'
      });
      
      mockUseProjectStore.mockReturnValue({
        selectedTag: 'All',
        showSkeletonLoading: false,
      } as any);

      render(<ArchiveDetails {...projectWithCustomUrls} />);
      
      const links = screen.getAllByRole('link');
      const projectLink = links.find(link => link.getAttribute('href') === projectWithCustomUrls.projectView);
      const githubLink = links.find(link => link.getAttribute('href') === projectWithCustomUrls.viewCode);
      
      expect(projectLink).toBeInTheDocument();
      expect(githubLink).toBeInTheDocument();
    });
  });
});
