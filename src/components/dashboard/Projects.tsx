import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import FormHeader from "./FormHeader";
import ItemsList from "./ItemsList";
import FormMessage from "./FormMessage";
import "./form.scss";
import { createProject, updateProject, deleteProject, getProjectLimits } from "@/app/dashboard/actions";
import { Project } from "@/types/data";
import { Platform } from "@/types/enum";

// Updated schema to match Prisma schema
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Subtitle is required"),
  images: z.string().url("Please enter a valid URL").min(1, "Image URL is required"),
  alt: z.string().min(1, "Alt text is required"),
  projectView: z.string().min(1, "Project View is required"),
  tools: z
    .array(z.string())
    .min(1, "At least one tool is required"),
  platform: z.string().min(1, "Platform is required"),
});

interface ProjectData {
  id: string;
  title: string;
  subTitle: string;
  images: string | string[]; // Can be either string or array
  alt: string;
  projectView: string;
  tools: string[];
  platform: string;
  portfolioId?: string;
}

interface ProjectLimits {
  maxWebProjects: number;
  maxDesignProjects: number;
  maxTotalProjects: number;
}

interface ProjectsFormProps {
  projectsData?: Project[] | null;
  portfolioId?: string;
}

const ProjectsForm = ({ projectsData, portfolioId }: ProjectsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectLimits, setProjectLimits] = useState<ProjectLimits | null>(null);
  const [imageLoadingStatus, setImageLoadingStatus] = useState<{
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
  }>({
    isLoading: false,
    hasError: false,
    errorMessage: "",
  });

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
      alt: "",
      projectView: "",
      tools: [],
      platform: "",
    },
  });

  // Watch platform field for validation
  const platformValue = watch("platform");

  // Load project limits on component mount
  useEffect(() => {
    const loadProjectLimits = async () => {
      const result = await getProjectLimits();
      if (result.success) {
        setProjectLimits(result.data);
      }
    };
    loadProjectLimits();
  }, []);

  // Debug form errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

  // Watch tools field to handle checkbox selection
  const toolsValue = watch("tools");

  // URL validation function
  const validateImageUrl = (url: string) => {
    if (!url) return { isValid: false, message: "URL is required" };
    
    try {
      const urlObj = new URL(url);
      const validProtocols = ['http:', 'https:'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      
      if (!validProtocols.includes(urlObj.protocol)) {
        return { isValid: false, message: "URL must use HTTP or HTTPS protocol" };
      }
      
      const hasValidExtension = validExtensions.some(ext => 
        urlObj.pathname.toLowerCase().includes(ext)
      );
      
      if (!hasValidExtension) {
        return { isValid: false, message: "URL should end with a valid image extension" };
      }
      
      return { isValid: true, message: "URL looks valid" };
    } catch (error) {
      return { isValid: false, message: "Invalid URL format" };
    }
  };

  // Load existing projects data from props when component mounts or data changes
  useEffect(() => {
    if (projectsData && Array.isArray(projectsData)) {
      setProjects(projectsData);
    } else {
      setProjects([]);
    }
  }, [projectsData]);

  // Calculate current project counts
  const currentWebProjects = projects.filter(p => p.platform === Platform.Web).length;
  const currentDesignProjects = projects.filter(p => p.platform === Platform.Design).length;
  const currentTotalProjects = projects.length;

  // Check if can create more projects
  const canCreateWebProjects = projectLimits ? currentWebProjects < projectLimits.maxWebProjects : true;
  const canCreateDesignProjects = projectLimits ? currentDesignProjects < projectLimits.maxDesignProjects : true;
  const canCreateTotalProjects = projectLimits ? currentTotalProjects < projectLimits.maxTotalProjects : true;

  // Server action handlers
  const handleCreateProject = async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'tools' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, value as string);
        }
      });
      
      // Add portfolioId if available
      if (portfolioId) {
        formData.append('portfolioId', portfolioId);
      }

      const result = await createProject(formData);
      if (result.success) {
        setMessage({ text: "Project created successfully!", isError: false });
        setCurrentProject(result.data);
        setIsEditing(false);
        // Refresh projects list
        if (result.data) {
          setProjects(prev => [...prev, result.data]);
        }
        reset();
        return { success: true, data: result.data };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to create project", isError: true });
      return { success: false, error: "Failed to create project" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (data: any) => {
    console.log("handleUpdateProject called with data:", data);
    console.log("currentProject:", currentProject);
    
    if (!currentProject?.id) return { success: false, error: "No project ID" };
    
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'tools' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, value as string);
        }
      });
      
      // Add portfolioId if available
      if (portfolioId) {
        formData.append('portfolioId', portfolioId);
      }

      const result = await updateProject(currentProject.id, formData);
      if (result.success) {
        setMessage({ text: "Project updated successfully!", isError: false });
        setCurrentProject(result.data);
        setIsEditing(false);
        // Update projects list
        if (result.data) {
          setProjects(prev => prev.map(p => p.id === result.data.id ? result.data : p));
        }
        return { success: true, data: result.data };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to update project", isError: true });
      return { success: false, error: "Failed to update project" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!projectId) return { success: false, error: "No project ID" };
    
    if (!confirm("Are you sure you want to delete this project?")) {
      return { success: false, error: "Deletion cancelled" };
    }
    
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    try {
      const result = await deleteProject(projectId);
      if (result.success) {
        setMessage({ text: "Project deleted successfully!", isError: false });
        setCurrentProject(null);
        setSelectedProjectId(null);
        // Remove from projects list
        setProjects(prev => prev.filter(p => p.id !== projectId));
        reset();
        return { success: true };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to delete project", isError: true });
      return { success: false, error: "Failed to delete project" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: ProjectData) => {
    setCurrentProject(project);
    setIsEditing(true);
    setMessage({ text: "", isError: false });
    
    // Populate form with project data
    setValue("title", project.title);
    setValue("subTitle", project.subTitle);
    setValue("images", Array.isArray(project.images) ? project.images[0] : project.images);
    setValue("alt", project.alt);
    setValue("projectView", project.projectView);
    setValue("tools", project.tools);
    setValue("platform", project.platform);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ text: "", isError: false });
    reset();
  };

  const handleCreateNew = () => {
    // Check if we can create more projects
    if (!canCreateTotalProjects) {
      setMessage({ 
        text: `Cannot create more projects. Maximum total projects limit reached (${projectLimits?.maxTotalProjects || 12}).`, 
        isError: true 
      });
      return;
    }

    setCurrentProject(null);
    setSelectedProjectId(null);
    setIsEditing(true);
    setMessage({ text: "", isError: false });
    reset();
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      // Populate form for viewing
      setValue("title", project.title);
      setValue("subTitle", project.subTitle);
      setValue("images", Array.isArray(project.images) ? project.images[0] : project.images);
      setValue("alt", project.alt);
      setValue("projectView", project.projectView);
      setValue("tools", project.tools);
      setValue("platform", project.platform);
    }
  };

  const refreshItems = () => {
    // This would typically refresh from the server
    // For now, we're using the props data
    setMessage({ text: "Projects refreshed", isError: false });
  };

  const isFieldDisabled = () => {
    // Allow editing when isEditing is true (either creating new or editing existing)
    // Disable only when loading
    return isLoading;
  };

  const renderProject = (project: ProjectData) => (
    <>
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
    </>
  );

  const getTitle = () => {
    if (isEditing) return "Edit Project";
    if (currentProject) return "View Project";
    return "Create Project";
  };

  return (
    <div className="form-container">
      <FormHeader
        title={getTitle()}
        isEditing={isEditing}
        hasCurrentItem={!!currentProject}
        isLoading={isLoading}
        onEdit={() => currentProject && handleEdit(currentProject)}
        onDelete={() => currentProject && handleDeleteProject(currentProject.id)}
        onCreateNew={handleCreateNew}
        onRefresh={refreshItems}
        itemName="Project"
      />

      {/* Project Limits Display */}
      {projectLimits && (
        <div className="project-limits">
          <h3>Project Limits</h3>
          <div className="limits-grid">
            <div className="limit-item">
              <span className="limit-label">Total Projects:</span>
              <span className={`limit-count ${!canCreateTotalProjects ? 'limit-reached' : ''}`}>
                {currentTotalProjects} / {projectLimits.maxTotalProjects}
              </span>
            </div>
            <div className="limit-item">
              <span className="limit-label">Web Projects:</span>
              <span className={`limit-count ${!canCreateWebProjects ? 'limit-reached' : ''}`}>
                {currentWebProjects} / {projectLimits.maxWebProjects}
              </span>
            </div>
            <div className="limit-item">
              <span className="limit-label">Design Projects:</span>
              <span className={`limit-count ${!canCreateDesignProjects ? 'limit-reached' : ''}`}>
                {currentDesignProjects} / {projectLimits.maxDesignProjects}
              </span>
            </div>
          </div>
          {!canCreateTotalProjects && (
            <div className="limit-warning">
              Maximum total projects limit reached. Cannot create more projects.
            </div>
          )}
        </div>
      )}

      <ItemsList
        items={projects}
        selectedItemId={selectedProjectId}
        onSelectItem={handleSelectProject}
        renderItem={renderProject}
        title="Existing Projects"
        itemName="Project"
        isLoading={isLoading}
      />

      <form onSubmit={handleSubmit(isEditing && currentProject ? handleUpdateProject : handleCreateProject)} className="form-layout">
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
          <label htmlFor="subTitle" className="form-label form-label--required">
            Subtitle
          </label>
          <input
            {...register("subTitle")}
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.subTitle && (
            <span className="form-error">{errors.subTitle.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="images" className="form-label form-label--required">
            Project Image URL
          </label>
          <input
            {...register("images")}
            type="url"
            placeholder="https://example.com/image.jpg"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.images && (
            <span className="form-error">{errors.images.message}</span>
          )}
          
          {/* Image Preview */}
          {watch("images") && (
            <div className="image-preview">
              <label className="form-label">Image Preview:</label>
              
              {/* Loading state */}
              {imageLoadingStatus.isLoading && (
                <div className="preview-container">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    background: '#f9fafb',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    color: '#6b7280'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                      <div>Loading image...</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error state */}
              {imageLoadingStatus.hasError && (
                <div className="preview-container">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    background: '#fef2f2',
                    border: '2px dashed #fecaca',
                    borderRadius: '8px',
                    color: '#dc2626',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Image failed to load</div>
                      <div style={{ fontSize: '12px', marginBottom: '8px' }}>{imageLoadingStatus.errorMessage}</div>
                      <button
                        onClick={() => {
                          setImageLoadingStatus({
                            isLoading: false,
                            hasError: false,
                            errorMessage: ""
                          });
                        }}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Success state - Next.js Image */}
              {!imageLoadingStatus.isLoading && !imageLoadingStatus.hasError && (
                <div className="preview-container">
                  <Image
                    src={watch("images")}
                    alt="Project preview"
                    width={300}
                    height={200}
                    className="preview-image"
                    onLoadStart={() => {
                      setImageLoadingStatus({
                        isLoading: true,
                        hasError: false,
                        errorMessage: ""
                      });
                    }}
                    onLoad={() => {
                      setImageLoadingStatus({
                        isLoading: false,
                        hasError: false,
                        errorMessage: ""
                      });
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", watch("images"));
                      setImageLoadingStatus({
                        isLoading: false,
                        hasError: true,
                        errorMessage: "Please check if the URL is valid and accessible"
                      });
                    }}
                    unoptimized={true}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              )}
              
              {/* URL validation info */}
              {(() => {
                const validation = validateImageUrl(watch("images"));
                return (
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '12px', 
                    color: validation.isValid ? '#059669' : '#dc2626',
                    padding: '8px',
                    background: validation.isValid ? '#f0fdf4' : '#fef2f2',
                    borderRadius: '4px',
                    border: `1px solid ${validation.isValid ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    <strong>URL:</strong> {watch("images")}
                    <br />
                    <small>
                      {validation.isValid ? (
                        <>
                          ✅ {validation.message}
                          <br />
                          💡 Tip: Make sure the URL is publicly accessible
                        </>
                      ) : (
                        <>
                          ❌ {validation.message}
                          <br />
                          💡 Tip: Try using a direct link to an image file (.jpg, .png, .gif, etc.)
                        </>
                      )}
                    </small>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="alt" className="form-label form-label--required">
            Image Alt Text
          </label>
          <input
            {...register("alt")}
            placeholder="Description of the project image"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.alt && (
            <span className="form-error">{errors.alt.message}</span>
          )}
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
          <label className="form-label form-label--required">
            Tools
          </label>
          <div className="tools-checkboxes">
            {[
              'React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB',
              'PostgreSQL', 'Tailwind CSS', 'GraphQL', 'Docker', 'AWS',
              'Python', 'Django', 'Vue.js', 'Angular', 'Express.js',
              'Redis', 'Elasticsearch', 'Kubernetes', 'Jenkins', 'Git'
            ].map((tool) => (
              <label key={tool} className="tool-checkbox">
                <input
                  type="checkbox"
                  value={tool}
                  checked={Array.isArray(toolsValue) && toolsValue.includes(tool)}
                  onChange={(e) => {
                    const currentTools = Array.isArray(toolsValue) ? toolsValue : [];
                    if (e.target.checked) {
                      setValue("tools", [...currentTools, tool]);
                    } else {
                      setValue("tools", currentTools.filter(t => t !== tool));
                    }
                  }}
                  disabled={isFieldDisabled()}
                  className="form-checkbox"
                />
                <span className="tool-label">{tool}</span>
              </label>
            ))}
          </div>
          {errors.tools && (
            <span className="form-error">{errors.tools.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="platform" className="form-label form-label--required">
            Platform
          </label>
          <select
            {...register("platform")}
            className="form-input"
            disabled={isFieldDisabled()}
          >
            <option value="">Select Platform</option>
            <option value={Platform.Web} disabled={!canCreateWebProjects}>
              Web {!canCreateWebProjects ? `(Limit reached: ${currentWebProjects}/${projectLimits?.maxWebProjects})` : ''}
            </option>
            <option value={Platform.Design} disabled={!canCreateDesignProjects}>
              Design {!canCreateDesignProjects ? `(Limit reached: ${currentDesignProjects}/${projectLimits?.maxDesignProjects})` : ''}
            </option>
          </select>
          {errors.platform && (
            <span className="form-error">{errors.platform.message}</span>
          )}
          {platformValue && platformValue === Platform.Web && !canCreateWebProjects && (
            <span className="form-error">Maximum Web projects limit reached. Cannot create more Web projects.</span>
          )}
          {platformValue && platformValue === Platform.Design && !canCreateDesignProjects && (
            <span className="form-error">Maximum Design projects limit reached. Cannot create more Design projects.</span>
          )}
        </div>

        {isEditing && currentProject && (
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

        {isEditing && !currentProject && (
          <button
            type="submit"
            className="form-button form-button--primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        )}
      </form>

      <FormMessage message={message} />
    </div>
  );
};

export default ProjectsForm;
