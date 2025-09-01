"use server";

import { fetchPortfolioDetailsData } from "@/service/apiService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

// Fetch portfolio details data
export async function getPortfolioData() {
  try {
    const data = await fetchPortfolioDetailsData();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return { success: false, error: "Failed to fetch portfolio data" };
  }
}

// Helper function to get authenticated fetch options
async function getAuthenticatedFetchOptions(method: string, body?: any) {
  const cookieStore = await cookies();
  const headerList = await headers();
  
  // Get all cookies and convert to cookie string
  const allCookies = cookieStore.getAll();
  const cookieString = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  
  // Get authorization header if it exists
  const authorization = headerList.get('authorization');
  
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookieString && { "Cookie": cookieString }),
      ...(authorization && { "Authorization": authorization }),
      // Forward other important headers
      "User-Agent": headerList.get('user-agent') || '',
      "Accept": headerList.get('accept') || 'application/json',
    },
    credentials: 'include', // Include cookies in the request
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return options;
}

// Create new portfolio
export async function createPortfolio(formData: FormData) {
  try {
    const portfolioData = {
      name: formData.get("name") as string,
      jobTitle: formData.get("jobTitle") as string,
      aboutDescription1: formData.get("aboutDescription1") as string,
      aboutDescription2: formData.get("aboutDescription2") as string,
      skills: (formData.get("skills") as string).split(",").map(s => s.trim()),
      email: formData.get("email") as string,
      ownerEmail: formData.get("ownerEmail") as string,
      linkedIn: formData.get("linkedIn") as string,
      gitHub: formData.get("gitHub") as string,
      facebook: formData.get("facebook") as string,
      instagram: formData.get("instagram") as string,
    };

    const fetchOptions = await getAuthenticatedFetchOptions("POST", portfolioData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/portfolio/create`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create portfolio: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create portfolio" };
  }
}

// Update portfolio
export async function updatePortfolio(id: string, formData: FormData) {
  try {
    const portfolioData = {
      name: formData.get("name") as string,
      jobTitle: formData.get("jobTitle") as string,
      aboutDescription1: formData.get("aboutDescription1") as string,
      aboutDescription2: formData.get("aboutDescription2") as string,
      skills: (formData.get("skills") as string).split(",").map(s => s.trim()),
      email: formData.get("email") as string,
      ownerEmail: formData.get("ownerEmail") as string,
      linkedIn: formData.get("linkedIn") as string,
      gitHub: formData.get("gitHub") as string,
      facebook: formData.get("facebook") as string,
      instagram: formData.get("instagram") as string,
    };

    const fetchOptions = await getAuthenticatedFetchOptions("PUT", portfolioData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/portfolio/${id}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update portfolio: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update portfolio" };
  }
}

// Delete portfolio
export async function deletePortfolio(id: string) {
  try {
    const fetchOptions = await getAuthenticatedFetchOptions("DELETE");
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/portfolio/${id}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete portfolio: ${response.status} ${response.statusText} - ${errorText}`);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete portfolio" };
  }
}

// Create new project
export async function createProject(formData: FormData) {
  try {
    const projectData = {
      title: formData.get("title") as string,
      subTitle: formData.get("subTitle") as string,
      images: formData.get("images") as string, // Single image as string
      alt: formData.get("alt") as string,
      projectView: formData.get("projectView") as string,
      tools: (formData.get("tools") as string).split(",").map(s => s.trim()),
      platform: formData.get("platform") as string,
      portfolioId: formData.get("portfolioId") as string,
    };

    const fetchOptions = await getAuthenticatedFetchOptions("POST", projectData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/projects/create`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create project" };
  }
}

// Update project
export async function updateProject(id: string, formData: FormData) {
  try {
    const projectData = {
      title: formData.get("title") as string,
      subTitle: formData.get("subTitle") as string,
      images: formData.get("images") as string, // Single image as string
      alt: formData.get("alt") as string,
      projectView: formData.get("projectView") as string,
      tools: (formData.get("tools") as string).split(",").map(s => s.trim()),
      platform: formData.get("platform") as string,
      portfolioId: formData.get("portfolioId") as string,
    };

    const fetchOptions = await getAuthenticatedFetchOptions("PUT", projectData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/projects/${id}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update project" };
  }
}

// Delete project
export async function deleteProject(id: string) {
  try {
    const fetchOptions = await getAuthenticatedFetchOptions("DELETE");
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/projects/${id}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete project" };
  }
}

// Create archive project
export async function createArchiveProject(formData: FormData) {
  try {
    const archiveData = {
      title: formData.get("title") as string,
      year: parseInt(formData.get("year") as string),
      isNew: formData.get("isNew") === "true",
      projectView: formData.get("projectView") as string,
      viewCode: formData.get("viewCode") as string,
      build: (formData.get("build") as string).split(",").map(s => s.trim()),
      portfolioId: formData.get("portfolioId") as string,
    };

    const fetchOptions = await getAuthenticatedFetchOptions("POST", archiveData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/archive-projects/create`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create archive project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating archive project:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create archive project" };
  }
}

// Update archive project
export async function updateArchiveProject(id: string, formData: FormData) {
  try {
    const archiveData = {
      title: formData.get("title") as string,
      year: parseInt(formData.get("year") as string),
      isNew: formData.get("isNew") === "true",
      projectView: formData.get("projectView") as string,
      viewCode: formData.get("viewCode") as string,
      build: (formData.get("build") as string).split(",").map(s => s.trim()),
      portfolioId: formData.get("portfolioId") as string,
    };

    const fetchOptions = await getAuthenticatedFetchOptions("PUT", archiveData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/archive-projects/${id}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update archive project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating archive project:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update archive project" };
  }
}

// Delete archive project
export async function deleteArchiveProject(id: string) {
  try {
    const fetchOptions = await getAuthenticatedFetchOptions("DELETE");
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/archive-projects/${id}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete archive project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting archive project:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete archive project" };
  }
}

// Get project limits configuration
export async function getProjectLimits() {
  try {
    const fetchOptions = await getAuthenticatedFetchOptions("GET");
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/config`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get project limits: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting project limits:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to get project limits" };
  }
}

// Update project limits configuration
export async function updateProjectLimits(formData: FormData) {
  try {
    const limitsData = {
      maxWebProjects: parseInt(formData.get("maxWebProjects") as string),
      maxDesignProjects: parseInt(formData.get("maxDesignProjects") as string),
      maxTotalProjects: parseInt(formData.get("maxTotalProjects") as string),
    };

    const fetchOptions = await getAuthenticatedFetchOptions("PUT", limitsData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/config`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update project limits: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating project limits:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update project limits" };
  }
}
