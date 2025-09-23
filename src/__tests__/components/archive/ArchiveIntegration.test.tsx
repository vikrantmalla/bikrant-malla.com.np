import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import Archive from '@/app/archive/page';
import ArchiveFilterMenu from '@/components/archive/ArchiveFilterMenu';
import ArchiveList from '@/components/archive/ArchiveList';
import ArchiveStoreProvider from '@/components/archive/ArchiveStoreProvider';
import { useProjectStore } from '@/store/feature/projectStore';

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

// Mock the API service
jest.mock('@/service/apiService', () => ({
  fetchPortfolioDetailsData: jest.fn(),
  fetchTagData: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseProjectStore = useProjectStore as jest.MockedFunction<typeof useProjectStore>;

const mockArchiveProjects = [
  {
    id: '1',
    title: 'CryptoMarket',
    year: 2019,
    isNew: true,
    build: ['React JS', 'Context API + Reducer', 'REST API', 'CSS'],
    projectView: 'https://cryptomarket09.netlify.app/',
    viewCode: 'https://github.com/vikrantmalla/CryptoMarket',
  },
  {
    id: '2',
    title: 'NepBazzar',
    year: 2025,
    isNew: true,
    build: ['Vue JS', 'Vuex'],
    projectView: 'https://nepbazzar.netlify.app/',
    viewCode: 'https://github.com/vikrantmalla/NepBazzar',
  },
];

const mockTechTags = [
  { id: '1', tag: 'All' },
  { id: '2', tag: 'CSS' },
  { id: '3', tag: 'Feature' },
  { id: '4', tag: 'HTML' },
  { id: '5', tag: 'React JS' },
];

describe('Archive Integration Tests', () => {
  const mockSetSelectedTag = jest.fn();
  const mockSetProjectList = jest.fn();
  const mockSetSkeletonLoading = jest.fn();
  const mockSortProjectList = jest.fn();
  const mockSetOriginalProjects = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('All'),
    } as any);

    mockUseProjectStore.mockReturnValue({
      projectList: mockArchiveProjects,
      originalProjects: mockArchiveProjects,
      selectedTag: 'All',
      showSkeletonLoading: false,
      isAscending: false,
      setSelectedTag: mockSetSelectedTag,
      setProjectList: mockSetProjectList,
      setSkeletonLoading: mockSetSkeletonLoading,
      sortProjectList: mockSortProjectList,
      setOriginalProjects: mockSetOriginalProjects,
    });
  });

  describe('Filter Integration', () => {
    it('filters projects correctly when React JS is selected', async () => {
      const mockFilterProjects = jest.fn().mockImplementation((tag) => {
        if (tag === 'React JS') {
          mockSetProjectList([mockArchiveProjects[0]]);
        }
      });

      mockUseProjectStore.mockReturnValue({
        projectList: [mockArchiveProjects[0]], // Only CryptoMarket
        originalProjects: mockArchiveProjects,
        selectedTag: 'React JS',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
        setOriginalProjects: mockSetOriginalProjects,
      });

      render(
        <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
          <ArchiveFilterMenu techTag={mockTechTags} />
          <ArchiveList />
        </ArchiveStoreProvider>
      );

      const reactJSButton = screen.getByRole('link', { name: /Filter by React JS projects/i });
      fireEvent.click(reactJSButton);

      await waitFor(() => {
        expect(screen.getByText('CryptoMarket')).toBeInTheDocument();
        expect(screen.queryByText('NepBazzar')).not.toBeInTheDocument();
      });
    });

    it('filters projects correctly when CSS is selected', async () => {
      mockUseProjectStore.mockReturnValue({
        projectList: [mockArchiveProjects[0]], // Only CryptoMarket (has CSS)
        originalProjects: mockArchiveProjects,
        selectedTag: 'CSS',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
        setOriginalProjects: mockSetOriginalProjects,
      });

      render(
        <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
          <ArchiveFilterMenu techTag={mockTechTags} />
          <ArchiveList />
        </ArchiveStoreProvider>
      );

      const cssButton = screen.getByRole('link', { name: /Filter by CSS projects/i });
      fireEvent.click(cssButton);

      await waitFor(() => {
        expect(screen.getByText('CryptoMarket')).toBeInTheDocument();
        expect(screen.queryByText('NepBazzar')).not.toBeInTheDocument();
      });
    });

    it('shows no projects message when filter returns empty results', async () => {
      mockUseProjectStore.mockReturnValue({
        projectList: [], // No projects
        originalProjects: mockArchiveProjects,
        selectedTag: 'HTML',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
        setOriginalProjects: mockSetOriginalProjects,
      });

      render(
        <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
          <ArchiveFilterMenu techTag={mockTechTags} />
          <ArchiveList />
        </ArchiveStoreProvider>
      );

      const htmlButton = screen.getByText('HTML');
      fireEvent.click(htmlButton);

      await waitFor(() => {
        expect(screen.getByText('No projects found for the selected filter')).toBeInTheDocument();
        expect(screen.queryByText('CryptoMarket')).not.toBeInTheDocument();
        expect(screen.queryByText('NepBazzar')).not.toBeInTheDocument();
      });
    });

    it('shows all projects when All filter is selected', async () => {
      mockUseProjectStore.mockReturnValue({
        projectList: mockArchiveProjects, // All projects
        originalProjects: mockArchiveProjects,
        selectedTag: 'All',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
        setOriginalProjects: mockSetOriginalProjects,
      });

      render(
        <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
          <ArchiveFilterMenu techTag={mockTechTags} />
          <ArchiveList />
        </ArchiveStoreProvider>
      );

      const allButton = screen.getByText('All');
      fireEvent.click(allButton);

      await waitFor(() => {
        expect(screen.getByText('CryptoMarket')).toBeInTheDocument();
        expect(screen.getByText('NepBazzar')).toBeInTheDocument();
      });
    });
  });

  describe('URL Parameter Integration', () => {
    it('handles URL parameter changes correctly', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue('react_js'),
      } as any);

      mockUseProjectStore.mockReturnValue({
        projectList: [mockArchiveProjects[0]],
        originalProjects: mockArchiveProjects,
        selectedTag: 'react_js',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
        setOriginalProjects: mockSetOriginalProjects,
      });

      render(
        <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
          <ArchiveFilterMenu techTag={mockTechTags} />
          <ArchiveList />
        </ArchiveStoreProvider>
      );

      // Should show React JS as selected
      const reactJSButton = screen.getByRole('link', { name: /Filter by React JS projects/i });
      expect(reactJSButton).toHaveClass('tag-selected');
    });
  });

  describe('Loading States', () => {
    it('shows loading state during filtering', () => {
      mockUseProjectStore.mockReturnValue({
        projectList: mockArchiveProjects,
        originalProjects: mockArchiveProjects,
        selectedTag: 'All',
        showSkeletonLoading: true,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
        setOriginalProjects: mockSetOriginalProjects,
      });

      render(
        <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
          <ArchiveList />
        </ArchiveStoreProvider>
      );

      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });
  });

  describe('Project Count Display', () => {
    it('shows correct project count for each filter', () => {
      mockUseProjectStore.mockReturnValue({
        projectList: [mockArchiveProjects[0]], // Only CryptoMarket
        originalProjects: mockArchiveProjects,
        selectedTag: 'React JS',
        showSkeletonLoading: false,
        isAscending: false,
        setSelectedTag: mockSetSelectedTag,
        setProjectList: mockSetProjectList,
        setSkeletonLoading: mockSetSkeletonLoading,
        sortProjectList: mockSortProjectList,
        setOriginalProjects: mockSetOriginalProjects,
      });

      render(
        <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
          <ArchiveFilterMenu techTag={mockTechTags} />
        </ArchiveStoreProvider>
      );

      expect(screen.getByText('React JS')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });
  });
});
