import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import "./form.scss";

const archiveProjectSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    year: z.string().min(1, "Year is required").transform((val) => parseInt(val, 10)),
    isNew: z.boolean().default(false),
    projectView: z.string().min(1, "Project View is required"),
    viewCode: z.string().min(1, "View Code is required"),
    build: z
      .string()
      .optional()
      .transform((val) =>
        val
          ? val
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : []
      ),
  });

interface ArchiveProjectData {
  id: string;
  title: string;
  year: number;
  isNew: boolean;
  projectView: string;
  viewCode: string;
  build: string[];
  portfolioId?: string;
}

const ArchiveProjectsForm = () => {
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isEditing, setIsEditing] = useState(false);
  const [currentArchiveProject, setCurrentArchiveProject] = useState<ArchiveProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [archiveProjects, setArchiveProjects] = useState<ArchiveProjectData[]>([]);
  const [selectedArchiveProjectId, setSelectedArchiveProjectId] = useState<string | null>(null);

  const { portfolioInfo } = useAuth();

  // Helper function to determine if fields should be disabled
  const isFieldDisabled = () => !isEditing && !!currentArchiveProject;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(archiveProjectSchema),
    defaultValues: {
      title: "",
      year: "",
      isNew: false,
      projectView: "",
      viewCode: "",
      build: "",
    },
  });

  // Fetch existing archive projects data
  useEffect(() => {
    const fetchArchiveProjects = async () => {
      try {
        const response = await fetch("/api/archive-projects");
        if (response.ok) {
          const archiveProjectsData = await response.json();
          setArchiveProjects(archiveProjectsData);
        }
      } catch (error) {
        console.error("Error fetching archive projects:", error);
      }
    };

    fetchArchiveProjects();
  }, []);

  // Get portfolio ID from user context or existing archive projects
  const getPortfolioId = async () => {
    // First try to get from user context (most reliable)
    if (portfolioInfo?.id) {
      return portfolioInfo.id;
    }
    
    // Fallback to existing archive projects
    if (archiveProjects.length > 0 && archiveProjects[0].portfolioId) {
      return archiveProjects[0].portfolioId;
    }
    
    // Last resort: try to get portfolio ID from user context via API
    try {
      const response = await fetch("/api/auth/check-role");
      if (response.ok) {
        const data = await response.json();
        if (data.user.portfolio?.id) {
          return data.user.portfolio.id;
        }
      }
    } catch (error) {
      console.error("Error fetching portfolio ID:", error);
    }
    
    return null;
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    const portfolioId = await getPortfolioId();
    if (!portfolioId) {
      setMessage({ text: "No portfolio found. Please create a portfolio first.", isError: true });
      setIsLoading(false);
      return;
    }

    try {
      let response;
      
      if (isEditing && currentArchiveProject) {
        // Update existing archive project
        response = await fetch(`/api/archive-projects/${currentArchiveProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create new archive project
        response = await fetch("/api/archive-projects/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, portfolioId }),
        });
      }

      const result = await response.json();

      if (response.ok) {
        setMessage({ 
          text: isEditing ? "Archive project updated successfully!" : "Archive project created successfully!", 
          isError: false 
        });
        
        if (!isEditing) {
          // If creating new, reset form
          reset();
        }
        
        // Refresh archive projects data
        const archiveProjectsResponse = await fetch("/api/archive-projects");
        if (archiveProjectsResponse.ok) {
          const archiveProjectsData = await archiveProjectsResponse.json();
          setArchiveProjects(archiveProjectsData);
        }
      } else {
        setMessage({
          text: result.error || `Failed to ${isEditing ? 'update' : 'create'} archive project`,
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: `An error occurred while ${isEditing ? 'updating' : 'submitting'} the form`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (archiveProject: ArchiveProjectData) => {
    setCurrentArchiveProject(archiveProject);
    setIsEditing(true);
    setMessage({ text: "", isError: false });
    
    // Populate form with archive project data
    setValue("title", archiveProject.title);
    setValue("year", archiveProject.year.toString());
    setValue("isNew", archiveProject.isNew);
    setValue("projectView", archiveProject.projectView);
    setValue("viewCode", archiveProject.viewCode);
    setValue("build", archiveProject.build ? archiveProject.build.join(", ") : "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentArchiveProject(null);
    setMessage({ text: "", isError: false });
    reset();
  };

  const handleDelete = async (archiveProjectId: string) => {
    if (!confirm("Are you sure you want to delete this archive project? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const response = await fetch(`/api/archive-projects/${archiveProjectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ text: "Archive project deleted successfully!", isError: false });
        
        // Remove from local state
        setArchiveProjects(archiveProjects.filter(p => p.id !== archiveProjectId));
        
        // Reset form if we were editing this archive project
        if (currentArchiveProject && currentArchiveProject.id === archiveProjectId) {
          setCurrentArchiveProject(null);
          setIsEditing(false);
          reset();
        }
      } else {
        const result = await response.json();
        setMessage({
          text: result.error || "Failed to delete archive project",
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while deleting the archive project",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    setCurrentArchiveProject(null);
    reset();
    setMessage({ text: "", isError: false });
  };

  const handleSelectArchiveProject = (archiveProjectId: string) => {
    setSelectedArchiveProjectId(archiveProjectId);
    const archiveProject = archiveProjects.find(p => p.id === archiveProjectId);
    if (archiveProject) {
      setCurrentArchiveProject(archiveProject);
      // Populate form for viewing
      setValue("title", archiveProject.title);
      setValue("year", archiveProject.year.toString());
      setValue("isNew", archiveProject.isNew);
      setValue("projectView", archiveProject.projectView);
      setValue("viewCode", archiveProject.viewCode);
      setValue("build", archiveProject.build ? archiveProject.build.join(", ") : "");
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">
          {isEditing ? "Edit Archive Project" : currentArchiveProject ? "View Archive Project" : "Create Archive Project"}
        </h1>
        
        <div className="form-actions">
          {currentArchiveProject && !isEditing && (
            <>
              <button 
                type="button" 
                onClick={() => handleEdit(currentArchiveProject)}
                className="form-button form-button--secondary"
              >
                Edit Archive Project
              </button>
              <button 
                type="button" 
                onClick={() => handleDelete(currentArchiveProject.id)}
                className="form-button form-button--danger"
                disabled={isLoading}
              >
                Delete Archive Project
              </button>
            </>
          )}
          <button 
            type="button" 
            onClick={handleCreateNew}
            className="form-button form-button--secondary"
          >
            Create New
          </button>
        </div>
      </div>

      {/* Archive Projects List */}
      {archiveProjects.length > 0 && (
        <div className="projects-list">
          <h3>Existing Archive Projects</h3>
          <div className="projects-grid">
            {archiveProjects.map((archiveProject) => (
              <div 
                key={archiveProject.id} 
                className={`project-card ${selectedArchiveProjectId === archiveProject.id ? 'project-card--selected' : ''}`}
                onClick={() => handleSelectArchiveProject(archiveProject.id)}
              >
                <h4>{archiveProject.title}</h4>
                <p><strong>Year:</strong> {archiveProject.year}</p>
                <p><strong>View:</strong> {archiveProject.projectView}</p>
                <p><strong>Code:</strong> {archiveProject.viewCode}</p>
                {archiveProject.build && archiveProject.build.length > 0 && (
                  <p><strong>Build:</strong> {archiveProject.build.join(", ")}</p>
                )}
                <p><strong>New:</strong> {archiveProject.isNew ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-layout">
        <div className="form-group">
          <label htmlFor="title" className="form-label form-label--required">
            Project Title
          </label>
          <input 
            {...register("title")} 
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.title && (
            <span className="form-error">{errors.title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="year" className="form-label form-label--required">
            Year
          </label>
          <input 
            {...register("year")} 
            type="number"
            min="1900"
            max="2100"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.year && (
            <span className="form-error">{errors.year.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="isNew" className="form-label">
            <input 
              {...register("isNew")} 
              type="checkbox"
              className="form-checkbox"
              disabled={isFieldDisabled()}
            />
            Is New Project
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="projectView" className="form-label form-label--required">
            Project View
          </label>
          <input 
            {...register("projectView")} 
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.projectView && (
            <span className="form-error">{errors.projectView.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="viewCode" className="form-label form-label--required">
            View Code
          </label>
          <input 
            {...register("viewCode")} 
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.viewCode && (
            <span className="form-error">{errors.viewCode.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="build" className="form-label">
            Build Tools (comma-separated)
          </label>
          <input
            {...register("build")}
            placeholder="e.g., React, Node.js, MongoDB"
            className="form-input"
            disabled={isFieldDisabled()}
          />
        </div>

        {isEditing && (
          <div className="form-actions-container">
            <button 
              type="submit" 
              className="form-button form-button--primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Archive Project"}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="form-button form-button--secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        )}

        {!currentArchiveProject && (
          <button 
            type="submit" 
            className="form-button form-button--primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Archive Project"}
          </button>
        )}
      </form>

      {message.text && (
        <div
          className={`form-message ${
            message.isError ? "form-message--error" : "form-message--success"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ArchiveProjectsForm;
