import React from 'react';
import { render } from '@testing-library/react';
import ArchiveStoreProvider from '@/components/archive/ArchiveStoreProvider';
import { useProjectStore } from '@/store/feature/projectStore';
import { createArchiveProjects, setFakerSeed, resetFakerSeed } from '@/__tests__/utils/testDataFactory';

// Mock the project store
jest.mock('@/store/feature/projectStore', () => ({
  useProjectStore: jest.fn(),
}));

const mockUseProjectStore = useProjectStore as jest.MockedFunction<typeof useProjectStore>;

// Generate test data with faker
let mockArchiveProjects: ReturnType<typeof createArchiveProjects>;

describe('ArchiveStoreProvider', () => {
  const mockSetProjectList = jest.fn();
  const mockSetOriginalProjects = jest.fn();

  beforeAll(() => {
    // Set consistent seed for predictable test data
    setFakerSeed(12345);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Generate fresh test data for each test
    mockArchiveProjects = createArchiveProjects(2);
    
    mockUseProjectStore.mockReturnValue({
      setProjectList: mockSetProjectList,
      setOriginalProjects: mockSetOriginalProjects,
    } as any);
  });

  afterAll(() => {
    // Reset faker seed for other tests
    resetFakerSeed();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
        <div>Test Child</div>
      </ArchiveStoreProvider>
    );
    
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes store with archive projects on mount', () => {
    render(
      <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
        <div>Test Child</div>
      </ArchiveStoreProvider>
    );
    
    expect(mockSetOriginalProjects).toHaveBeenCalledWith(mockArchiveProjects);
    expect(mockSetProjectList).toHaveBeenCalledWith(mockArchiveProjects);
  });

  it('does not initialize store when archiveProjects is empty', () => {
    render(
      <ArchiveStoreProvider archiveProjects={[]}>
        <div>Test Child</div>
      </ArchiveStoreProvider>
    );
    
    expect(mockSetOriginalProjects).not.toHaveBeenCalled();
    expect(mockSetProjectList).not.toHaveBeenCalled();
  });

  it('updates store when archiveProjects prop changes', () => {
    const { rerender } = render(
      <ArchiveStoreProvider archiveProjects={[]}>
        <div>Test Child</div>
      </ArchiveStoreProvider>
    );
    
    // Initially should not call store methods
    expect(mockSetOriginalProjects).not.toHaveBeenCalled();
    expect(mockSetProjectList).not.toHaveBeenCalled();
    
    // Rerender with projects
    rerender(
      <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
        <div>Test Child</div>
      </ArchiveStoreProvider>
    );
    
    expect(mockSetOriginalProjects).toHaveBeenCalledWith(mockArchiveProjects);
    expect(mockSetProjectList).toHaveBeenCalledWith(mockArchiveProjects);
  });

  it('handles multiple children correctly', () => {
    const { getByText } = render(
      <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
        <div>Child 1</div>
        <div>Child 2</div>
        <span>Child 3</span>
      </ArchiveStoreProvider>
    );
    
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
    expect(getByText('Child 3')).toBeInTheDocument();
  });

  it('calls store methods only once per archiveProjects change', () => {
    const { rerender } = render(
      <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
        <div>Test Child</div>
      </ArchiveStoreProvider>
    );
    
    // Should be called once on initial render
    expect(mockSetOriginalProjects).toHaveBeenCalledTimes(1);
    expect(mockSetProjectList).toHaveBeenCalledTimes(1);
    
    // Rerender with same projects - should not call again
    rerender(
      <ArchiveStoreProvider archiveProjects={mockArchiveProjects}>
        <div>Test Child</div>
      </ArchiveStoreProvider>
    );
    
    // Should still be called only once
    expect(mockSetOriginalProjects).toHaveBeenCalledTimes(1);
    expect(mockSetProjectList).toHaveBeenCalledTimes(1);
  });
});
