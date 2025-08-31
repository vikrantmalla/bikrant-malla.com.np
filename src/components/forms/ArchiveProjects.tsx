import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import FormHeader from "./FormHeader";
import ItemsList from "./ItemsList";
import FormMessage from "./FormMessage";
import "./form.scss";
import { createArchiveProject, updateArchiveProject, deleteArchiveProject } from "@/app/dashboard/actions";
import { ArchiveProject } from "@/types/data";

// Updated schema to match Prisma schema
const archiveProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z
    .string()
    .min(1, "Year is required")
    .transform((val) => parseInt(val, 10)),
  isNew: z.boolean().default(false),
  projectView: z.string().min(1, "Project View is required"),
  viewCode: z.string().min(1, "View Code is required"),
  build: z
    .array(z.string())
    .optional()
    .default([]),
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

interface ArchiveProjectsFormProps {
  archiveProjectsData?: ArchiveProject[] | null;
}

const ArchiveProjectsForm = ({ archiveProjectsData }: ArchiveProjectsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
  const [currentArchiveProject, setCurrentArchiveProject] = useState<ArchiveProjectData | null>(null);
  const [archiveProjects, setArchiveProjects] = useState<ArchiveProjectData[]>([]);
  const [selectedArchiveProjectId, setSelectedArchiveProjectId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(archiveProjectSchema),
    defaultValues: {
      title: "",
      year: "",
      isNew: false,
      projectView: "",
      viewCode: "",
      build: [],
    },
  });

  // Watch build field to handle checkbox selection
  const buildValue = watch("build");

  // Load existing archive projects data from props when component mounts or data changes
  useEffect(() => {
    if (archiveProjectsData && Array.isArray(archiveProjectsData)) {
      setArchiveProjects(archiveProjectsData);
    } else {
      setArchiveProjects([]);
    }
  }, [archiveProjectsData]);

  // Server action handlers
  const handleCreateArchiveProject = async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'build' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (key === 'year') {
          formData.append(key, value.toString());
        } else if (key === 'isNew') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      });

      const result = await createArchiveProject(formData);
      if (result.success) {
        setMessage({ text: "Archive project created successfully!", isError: false });
        setCurrentArchiveProject(result.data);
        setIsEditing(false);
        // Refresh archive projects list
        if (result.data) {
          setArchiveProjects(prev => [...prev, result.data]);
        }
        reset();
        return { success: true, data: result.data };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to create archive project", isError: true });
      return { success: false, error: "Failed to create archive project" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateArchiveProject = async (data: any) => {
    if (!currentArchiveProject?.id) return { success: false, error: "No archive project ID" };
    
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'build' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (key === 'year') {
          formData.append(key, value.toString());
        } else if (key === 'isNew') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      });

      const result = await updateArchiveProject(currentArchiveProject.id, formData);
      if (result.success) {
        setMessage({ text: "Archive project updated successfully!", isError: false });
        setCurrentArchiveProject(result.data);
        setIsEditing(false);
        // Update archive projects list
        if (result.data) {
          setArchiveProjects(prev => prev.map(p => p.id === result.data.id ? result.data : p));
        }
        return { success: true, data: result.data };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to update archive project", isError: true });
      return { success: false, error: "Failed to update archive project" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArchiveProject = async (projectId: string) => {
    if (!projectId) return { success: false, error: "No archive project ID" };
    
    if (!confirm("Are you sure you want to delete this archive project?")) {
      return { success: false, error: "Deletion cancelled" };
    }
    
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    try {
      const result = await deleteArchiveProject(projectId);
      if (result.success) {
        setMessage({ text: "Archive project deleted successfully!", isError: false });
        setCurrentArchiveProject(null);
        setSelectedArchiveProjectId(null);
        // Remove from archive projects list
        setArchiveProjects(prev => prev.filter(p => p.id !== projectId));
        reset();
        return { success: true };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to delete archive project", isError: true });
      return { success: false, error: "Failed to delete archive project" };
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
    setValue("build", archiveProject.build || []);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ text: "", isError: false });
    reset();
  };

  const handleCreateNew = () => {
    setCurrentArchiveProject(null);
    setSelectedArchiveProjectId(null);
    setIsEditing(true);
    setMessage({ text: "", isError: false });
    reset();
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
      setValue("build", archiveProject.build || []);
    }
  };

  const refreshItems = () => {
    // This would typically refresh from the server
    // For now, we're using the props data
    setMessage({ text: "Archive projects refreshed", isError: false });
  };

  const isFieldDisabled = () => {
    return !isEditing || isLoading;
  };

  const renderArchiveProject = (archiveProject: ArchiveProjectData) => (
    <>
      <h4>{archiveProject.title}</h4>
      <p>
        <strong>Year:</strong> {archiveProject.year}
      </p>
      <p>
        <strong>View:</strong> {archiveProject.projectView}
      </p>
      <p>
        <strong>Code:</strong> {archiveProject.viewCode}
      </p>
      {archiveProject.build && archiveProject.build.length > 0 && (
        <p>
          <strong>Build:</strong> {archiveProject.build.join(", ")}
        </p>
      )}
      <p>
        <strong>New:</strong> {archiveProject.isNew ? "Yes" : "No"}
      </p>
    </>
  );

  const getTitle = () => {
    if (isEditing) return "Edit Archive Project";
    if (currentArchiveProject) return "View Archive Project";
    return "Create Archive Project";
  };

  return (
    <div className="form-container">
      <FormHeader
        title={getTitle()}
        isEditing={isEditing}
        hasCurrentItem={!!currentArchiveProject}
        isLoading={isLoading}
        onEdit={() => currentArchiveProject && handleEdit(currentArchiveProject)}
        onDelete={() => currentArchiveProject && handleDeleteArchiveProject(currentArchiveProject.id)}
        onCreateNew={handleCreateNew}
        onRefresh={refreshItems}
        itemName="Archive Project"
      />

      <ItemsList
        items={archiveProjects}
        selectedItemId={selectedArchiveProjectId}
        onSelectItem={handleSelectArchiveProject}
        renderItem={renderArchiveProject}
        title="Existing Archive Projects"
        itemName="Archive Project"
        isLoading={isLoading}
      />

      <form onSubmit={handleSubmit(isEditing ? handleUpdateArchiveProject : handleCreateArchiveProject)} className="form-layout">
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
            min="2019"
            max={new Date().getFullYear()}
            defaultValue={new Date().getFullYear()}
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
          <label className="form-label">
            Build Tools
          </label>
          <div className="tools-checkboxes">
            {[
              'React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB',
              'PostgreSQL', 'Tailwind CSS', 'GraphQL', 'Docker', 'AWS',
              'Python', 'Django', 'Vue.js', 'Angular', 'Express.js',
              'Redis', 'Elasticsearch', 'Kubernetes', 'Jenkins', 'Git',
              'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier', 'Jest',
              'Cypress', 'Storybook', 'Rollup', 'Parcel', 'Gulp'
            ].map((tool) => (
              <label key={tool} className="tool-checkbox">
                <input
                  type="checkbox"
                  value={tool}
                  checked={Array.isArray(buildValue) && buildValue.includes(tool)}
                  onChange={(e) => {
                    const currentBuild = Array.isArray(buildValue) ? buildValue : [];
                    if (e.target.checked) {
                      setValue("build", [...currentBuild, tool]);
                    } else {
                      setValue("build", currentBuild.filter(t => t !== tool));
                    }
                  }}
                  disabled={isFieldDisabled()}
                  className="form-checkbox"
                />
                <span className="tool-label">{tool}</span>
              </label>
            ))}
          </div>
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

      <FormMessage message={message} />
    </div>
  );
};

export default ArchiveProjectsForm;
