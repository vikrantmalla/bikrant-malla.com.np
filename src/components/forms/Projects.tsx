import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { clientApi } from "@/service/apiService";
import "./form.scss";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().optional(),
  images: z.string().optional(),
  imageUrl: z.string().optional(),
  alt: z.string().optional(),
  projectView: z.string().min(1, "Project View is required"),
  tools: z
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
  platform: z.string().optional(),
});

interface ProjectData {
  id: string;
  title: string;
  subTitle?: string;
  images?: string;
  imageUrl?: string;
  alt?: string;
  projectView: string;
  tools: string[];
  platform?: string;
  portfolioId?: string;
}

const ProjectsForm = () => {
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const hasFetched = useRef(false);

  const { portfolioInfo } = useAuth();

  // Helper function to determine if fields should be disabled
  const isFieldDisabled = () => !isEditing && !!currentProject;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      images: "",
      imageUrl: "",
      alt: "",
      projectView: "",
      tools: "",
      platform: "",
    },
  });

  // Fetch existing projects data
  useEffect(() => {
    if (hasFetched.current) return;
    
    const fetchProjects = async () => {
      try {
        const projectsData = await clientApi.projects.get();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        hasFetched.current = true;
      }
    };

    fetchProjects();
  }, []); // Empty dependency array to run only once on mount

  // Get portfolio ID from user context or existing projects
  const getPortfolioId = async () => {
    // First try to get from user context (most reliable)
    if (portfolioInfo?.id) {
      return portfolioInfo.id;
    }

    // Fallback to existing projects
    if (projects.length > 0 && projects[0].portfolioId) {
      return projects[0].portfolioId;
    }

    // Last resort: try to get portfolio ID from user context via API
    try {
      const data = await clientApi.auth.checkRole();
      if (data.user.portfolio?.id) {
        return data.user.portfolio.id;
      }
    } catch (error) {
      console.error("Error fetching portfolio ID:", error);
    }

    return null;
  };

  const onSubmit = useCallback(async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    // Validate required fields before submission
    if (!data.title?.trim() || !data.projectView?.trim()) {
      setMessage({
        text: "Please fill in all required fields (Title and Project View are required)",
        isError: true,
      });
      setIsLoading(false);
      return;
    }

    const portfolioId = await getPortfolioId();
    if (!portfolioId) {
      setMessage({
        text: "No portfolio found. Please create a portfolio first.",
        isError: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      let result;

      if (isEditing && currentProject) {
        // Update existing project
        result = await clientApi.projects.update(currentProject.id, data);
      } else {
        // Create new project
        result = await clientApi.projects.create({ ...data, portfolioId });
      }

      if (result) {
        setMessage({
          text: isEditing
            ? "Project updated successfully!"
            : "Project created successfully!",
          isError: false,
        });

        if (!isEditing) {
          // If creating new, reset form
          reset();
        }

        // Refresh projects data
        try {
          const projectsData = await clientApi.projects.get();
          setProjects(projectsData);
        } catch (error) {
          console.error("Error refreshing projects:", error);
        }
      } else {
        setMessage({
          text: `Failed to ${isEditing ? "update" : "create"} project`,
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: `An error occurred while ${
          isEditing ? "updating" : "submitting"
        } the form`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isEditing, currentProject, portfolioInfo, projects, reset]);

  const handleEdit = useCallback((project: ProjectData) => {
    setCurrentProject(project);
    setIsEditing(true);
    setMessage({ text: "", isError: false });

    // Populate form with project data - ensure required fields have valid values
    setValue("title", project.title || "");
    setValue("subTitle", project.subTitle || "");
    setValue("images", project.images || "");
    setValue("imageUrl", project.imageUrl || "");
    setValue("alt", project.alt || "");
    setValue("projectView", project.projectView || "");
    setValue("tools", project.tools ? project.tools.join(", ") : "");
    setValue("platform", project.platform || "");
  }, [setValue]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setCurrentProject(null);
    setMessage({ text: "", isError: false });
    reset();
  }, [reset]);

  const handleDelete = useCallback(async (projectId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const result = await clientApi.projects.delete(projectId);

      if (result) {
        setMessage({ text: "Project deleted successfully!", isError: false });

        // Remove from local state
        setProjects(projects.filter((p) => p.id !== projectId));

        // Reset form if we were editing this project
        if (currentProject && currentProject.id === projectId) {
          setCurrentProject(null);
          setIsEditing(false);
          reset();
        }
      } else {
        setMessage({
          text: "Failed to delete project",
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while deleting the project",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, projects, reset]);

  const handleCreateNew = useCallback(() => {
    setIsEditing(false);
    setCurrentProject(null);
    reset();
    setMessage({ text: "", isError: false });
  }, [reset]);

  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      // Populate form for viewing - ensure required fields have valid values
      setValue("title", project.title || "");
      setValue("subTitle", project.subTitle || "");
      setValue("images", project.images || "");
      setValue("imageUrl", project.imageUrl || "");
      setValue("alt", project.alt || "");
      setValue("projectView", project.projectView || "");
      setValue("tools", project.tools ? project.tools.join(", ") : "");
      setValue("platform", project.platform || "");
    }
  }, [projects, setValue]);

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">
          {isEditing
            ? "Edit Project"
            : currentProject
            ? "View Project"
            : "Create Project"}
        </h1>

        <div className="form-actions">
          {currentProject && !isEditing && (
            <>
              <button
                type="button"
                onClick={() => handleEdit(currentProject)}
                className="form-button form-button--secondary"
                title="Edit Project"
              >
                <FaEdit />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(currentProject.id)}
                className="form-button form-button--danger"
                disabled={isLoading}
                title="Delete Project"
              >
                <FaTrash />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleCreateNew}
            className="form-button form-button--secondary"
            title="Create New Project"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="projects-list">
          <h3>Existing Projects</h3>
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-card ${
                  selectedProjectId === project.id
                    ? "project-card--selected"
                    : ""
                }`}
                onClick={() => handleSelectProject(project.id)}
              >
                <h4>{project.title}</h4>
                {project.subTitle && (
                  <p>
                    <strong>Subtitle:</strong> {project.subTitle}
                  </p>
                )}
                <p>
                  <strong>View:</strong> {project.projectView}
                </p>
                {project.tools && project.tools.length > 0 && (
                  <p>
                    <strong>Tools:</strong> {project.tools.join(", ")}
                  </p>
                )}
                {project.platform && (
                  <p>
                    <strong>Platform:</strong> {project.platform}
                  </p>
                )}
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
          <label htmlFor="subTitle" className="form-label">
            Subtitle
          </label>
          <input
            {...register("subTitle")}
            className="form-input"
            disabled={isFieldDisabled()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="images" className="form-label">
            Images (comma-separated URLs)
          </label>
          <input
            {...register("images")}
            placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
            className="form-input"
            disabled={isFieldDisabled()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl" className="form-label">
            Main Image URL
          </label>
          <input
            {...register("imageUrl")}
            placeholder="https://example.com/main-image.jpg"
            className="form-input"
            disabled={isFieldDisabled()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="alt" className="form-label">
            Image Alt Text
          </label>
          <input
            {...register("alt")}
            placeholder="Description of the image"
            className="form-input"
            disabled={isFieldDisabled()}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="projectView"
            className="form-label form-label--required"
          >
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
          <label htmlFor="tools" className="form-label form-label--required">
            Tools (comma-separated)
          </label>
          <input
            {...register("tools")}
            placeholder="e.g., React, Node.js, MongoDB"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.tools && (
            <span className="form-error">{errors.tools.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="platform" className="form-label">
            Platform
          </label>
          <input
            {...register("platform")}
            placeholder="e.g., Web, Mobile, Desktop"
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
              {isLoading ? "Updating..." : "Update Project"}
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

        {!currentProject && (
          <button
            type="submit"
            className="form-button form-button--primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
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

export default ProjectsForm;
