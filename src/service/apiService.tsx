import { baseUrl } from "@/helpers/lib/baseUrl";
import Data, {
  ArchiveDetailsData,
  PortfolioDetails,
  TechTag,
  Portfolio,
  Project,
  ArchiveProject,
} from "@/types/data";
import {
  ARCHIVE_ENDPOINT,
  CONTACT_ENDPOINT,
  PORTFOLIO_DETAILS_ENDPOINT,
  TECH_TAGS_ENDPOINT,
} from "./endpoints";

// Type for tech tags API response
interface TechTagsResponse {
  message: string;
  techTags: TechTag[];
}

// Type for portfolio create/update data
interface PortfolioCreateData {
  name: string;
  jobTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  skills: string[];
  email: string;
  ownerEmail: string;
  linkedIn: string;
  gitHub: string;
  facebook: string;
  instagram: string;
}

// Type for project create/update data
interface ProjectCreateData {
  title: string;
  subTitle: string;
  images: string;
  imageUrl: string;
  alt: string;
  projectView: string;
  tools: string[];
  platform: string;
  portfolioId?: string;
}

// Type for archive project create/update data
interface ArchiveProjectCreateData {
  title: string;
  year: number;
  isNew: boolean;
  projectView: string;
  viewCode: string;
  build: string[];
  portfolioId?: string;
}

async function fetchData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${baseUrl}/${endpoint}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const data: T = await res.json();
  return data;
}

// GET METHOD
export async function fetchPortfolioDetailsData(): Promise<PortfolioDetails> {
  return fetchData<PortfolioDetails>(PORTFOLIO_DETAILS_ENDPOINT);
}

export async function fetchProjectData(): Promise<ArchiveDetailsData> {
  return fetchData<ArchiveDetailsData>(ARCHIVE_ENDPOINT);
}

export async function fetchContactData(): Promise<Data.Contact> {
  return fetchData<Data.Contact>(CONTACT_ENDPOINT);
}

export async function fetchTagData(): Promise<TechTagsResponse> {
  return fetchData<TechTagsResponse>(TECH_TAGS_ENDPOINT);
}

// ===== CLIENT-SIDE API FUNCTIONS =====

// Generic API client for client-side components
class ApiClient {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async makeRequest<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const cacheKey = `${endpoint}-${JSON.stringify(options || {})}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make the request
    const requestPromise = fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();

        // Cache the successful response
        this.cache.set(cacheKey, { data, timestamp: Date.now() });

        return data;
      })
      .finally(() => {
        // Remove from pending requests
        this.pendingRequests.delete(cacheKey);
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // Portfolio API
  async getPortfolio(): Promise<Portfolio> {
    return this.makeRequest<Portfolio>("/api/portfolio");
  }

  async createPortfolio(data: PortfolioCreateData): Promise<Portfolio> {
    return this.makeRequest<Portfolio>("/api/portfolio/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePortfolio(
    id: string,
    data: Partial<PortfolioCreateData>
  ): Promise<Portfolio> {
    return this.makeRequest<Portfolio>(`/api/portfolio/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return this.makeRequest<boolean>(`/api/portfolio/${id}`, {
      method: "DELETE",
    });
  }

  // Projects API
  async getProjects(): Promise<Project[]> {
    return this.makeRequest<Project[]>("/api/projects");
  }

  async createProject(data: ProjectCreateData): Promise<Project> {
    return this.makeRequest<Project>("/api/projects/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(
    id: string,
    data: Partial<ProjectCreateData>
  ): Promise<Project> {
    return this.makeRequest<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.makeRequest<boolean>(`/api/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Archive Projects API
  async getArchiveProjects(): Promise<ArchiveProject[]> {
    return this.makeRequest<ArchiveProject[]>("/api/archive-projects");
  }

  async createArchiveProject(
    data: ArchiveProjectCreateData
  ): Promise<ArchiveProject> {
    return this.makeRequest<ArchiveProject>("/api/archive-projects/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateArchiveProject(
    id: string,
    data: Partial<ArchiveProjectCreateData>
  ): Promise<ArchiveProject> {
    return this.makeRequest<ArchiveProject>(`/api/archive-projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteArchiveProject(id: string): Promise<boolean> {
    return this.makeRequest<boolean>(`/api/archive-projects/${id}`, {
      method: "DELETE",
    });
  }

  // Auth API
  async checkUserRole(): Promise<any> {
    return this.makeRequest("/api/auth/check-role");
  }

  // Generic methods for any endpoint
  async get(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint);
  }

  async post(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint, {
      method: "DELETE",
    });
  }

  // Clear cache for specific endpoint
  clearCache(endpoint?: string): void {
    if (endpoint) {
      // Clear specific endpoint cache
      for (const key of this.cache.keys()) {
        if (key.startsWith(endpoint)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  // Invalidate cache for specific endpoint
  invalidateCache(endpoint: string): void {
    this.clearCache(endpoint);
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Convenience functions for backward compatibility
export const clientApi = {
  portfolio: {
    get: () => apiClient.getPortfolio(),
    create: (data: PortfolioCreateData) => apiClient.createPortfolio(data),
    update: (id: string, data: Partial<PortfolioCreateData>) =>
      apiClient.updatePortfolio(id, data),
    delete: (id: string) => apiClient.deletePortfolio(id),
  },
  projects: {
    get: () => apiClient.getProjects(),
    create: (data: ProjectCreateData) => apiClient.createProject(data),
    update: (id: string, data: Partial<ProjectCreateData>) =>
      apiClient.updateProject(id, data),
    delete: (id: string) => apiClient.deleteProject(id),
  },
  archiveProjects: {
    get: () => apiClient.getArchiveProjects(),
    create: (data: ArchiveProjectCreateData) =>
      apiClient.createArchiveProject(data),
    update: (id: string, data: Partial<ArchiveProjectCreateData>) =>
      apiClient.updateArchiveProject(id, data),
    delete: (id: string) => apiClient.deleteArchiveProject(id),
  },
  auth: {
    checkRole: () => apiClient.checkUserRole(),
  },
  cache: {
    clear: (endpoint?: string) => apiClient.clearCache(endpoint),
    invalidate: (endpoint: string) => apiClient.invalidateCache(endpoint),
  },
};
