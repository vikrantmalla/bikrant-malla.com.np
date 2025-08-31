import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import FormHeader from "./FormHeader";
import ItemsList from "./ItemsList";
import FormMessage from "./FormMessage";
import "./form.scss";
import { createProject, updateProject, deleteProject } from "@/app/dashboard/actions";
import { Project } from "@/types/data";

// Updated schema to match Prisma schema
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Subtitle is required"),
  images: z.string().min(1, "Images are required"),
  imageUrl: z.string().min(1, "Image URL is required"),
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
  images: string;
  imageUrl: string;
  alt: string;
  projectView: string;
  tools: string[];
  platform: string;
  portfolioId?: string;
}

interface ProjectsFormProps {
  projectsData?: Project[] | null;
}

const ProjectsForm = ({ projectsData }: ProjectsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
      tools: [],
      platform: "",
    },
  });

  // Watch tools field to handle checkbox selection
  const toolsValue = watch("tools");

  // Load existing projects data from props when component mounts or data changes
  useEffect(() => {
    if (projectsData && Array.isArray(projectsData)) {
      setProjects(projectsData);
    } else {
      setProjects([]);
    }
  }, [projectsData]);

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
    setValue("images", project.images);
    setValue("imageUrl", project.imageUrl);
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
      setValue("images", project.images);
      setValue("imageUrl", project.imageUrl);
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
    return !isEditing || isLoading;
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

      <ItemsList
        items={projects}
        selectedItemId={selectedProjectId}
        onSelectItem={handleSelectProject}
        renderItem={renderProject}
        title="Existing Projects"
        itemName="Project"
        isLoading={isLoading}
      />

      <form onSubmit={handleSubmit(isEditing ? handleUpdateProject : handleCreateProject)} className="form-layout">
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
            Images (comma-separated URLs)
          </label>
          <input
            {...register("images")}
            placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.images && (
            <span className="form-error">{errors.images.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl" className="form-label form-label--required">
            Main Image URL
          </label>
          <input
            {...register("imageUrl")}
            placeholder="https://example.com/main-image.jpg"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.imageUrl && (
            <span className="form-error">{errors.imageUrl.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="alt" className="form-label form-label--required">
            Image Alt Text
          </label>
          <input
            {...register("alt")}
            placeholder="Description of the image"
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
            <option value="Web">Web</option>
            <option value="Design">Design</option>
          </select>
          {errors.platform && (
            <span className="form-error">{errors.platform.message}</span>
          )}
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

      <FormMessage message={message} />
    </div>
  );
};

export default ProjectsForm;
