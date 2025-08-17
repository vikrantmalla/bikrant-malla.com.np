import { baseUrl } from "@/helpers/lib/baseUrl";
import Data, { ArchiveDetailsData, PortfolioDetails } from "@/types/data";
import {
  ABOUT_ME_ENDPOINT,
  BEHANCE_ENDPOINT,
  CONTACT_ENDPOINT,
  META_DATA_ENDPOINT,
  PORTFOLIO_DETAILS_ENDPOINT,
  PROJECTS_ENDPOINT,
  PROJECT_HIGHLIGHTS_ENDPOINT,
} from "./endpoints";

async function fetchData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${baseUrl}/${endpoint}`, {
    cache: 'no-store'
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
  return fetchData<ArchiveDetailsData>(PROJECTS_ENDPOINT);
}

// GET, POST, PUT, DELETE METHOD
export async function fetchAboutMeData(): Promise<Data.AboutMeData> {
  return fetchData<Data.AboutMeData>(ABOUT_ME_ENDPOINT);
}
export async function fetchProjectHighlights(): Promise<Data.ProjectHighlightData> {
  return fetchData<Data.ProjectHighlightData>(PROJECT_HIGHLIGHTS_ENDPOINT);
}

export async function fetchBehanceData(): Promise<Data.BehanceData> {
  return fetchData<Data.BehanceData>(BEHANCE_ENDPOINT);
}

export async function fetchContactData(): Promise<Data.Contact> {
  return fetchData<Data.Contact>(CONTACT_ENDPOINT);
}

export async function fetchMetaData(): Promise<Data.MetaData> {
  return fetchData<Data.MetaData>(META_DATA_ENDPOINT);
}

// export async function fetchTagData()  {
// fetchData(TAGS_ENDPOINT)
// // }

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
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Cache the successful response
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    }).finally(() => {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
    });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // Portfolio API
  async getPortfolio(): Promise<any> {
    return this.makeRequest('/api/portfolio');
  }

  async createPortfolio(data: any): Promise<any> {
    return this.makeRequest('/api/portfolio/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolio(id: string, data: any): Promise<any> {
    return this.makeRequest(`/api/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(id: string): Promise<any> {
    return this.makeRequest(`/api/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects API
  async getProjects(): Promise<any> {
    return this.makeRequest('/api/projects');
  }

  async createProject(data: any): Promise<any> {
    return this.makeRequest('/api/projects/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any): Promise<any> {
    return this.makeRequest(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<any> {
    return this.makeRequest(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Archive Projects API
  async getArchiveProjects(): Promise<any> {
    return this.makeRequest('/api/archive-projects');
  }

  async createArchiveProject(data: any): Promise<any> {
    return this.makeRequest('/api/archive-projects/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArchiveProject(id: string, data: any): Promise<any> {
    return this.makeRequest(`/api/archive-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteArchiveProject(id: string): Promise<any> {
    return this.makeRequest(`/api/archive-projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth API
  async checkUserRole(): Promise<any> {
    return this.makeRequest('/api/auth/check-role');
  }

  // Generic methods for any endpoint
  async get(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint);
  }

  async post(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
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
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Convenience functions for backward compatibility
export const clientApi = {
  portfolio: {
    get: () => apiClient.getPortfolio(),
    create: (data: any) => apiClient.createPortfolio(data),
    update: (id: string, data: any) => apiClient.updatePortfolio(id, data),
    delete: (id: string) => apiClient.deletePortfolio(id),
  },
  projects: {
    get: () => apiClient.getProjects(),
    create: (data: any) => apiClient.createProject(data),
    update: (id: string, data: any) => apiClient.updateProject(id, data),
    delete: (id: string) => apiClient.deleteProject(id),
  },
  archiveProjects: {
    get: () => apiClient.getArchiveProjects(),
    create: (data: any) => apiClient.createArchiveProject(data),
    update: (id: string, data: any) => apiClient.updateArchiveProject(id, data),
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
