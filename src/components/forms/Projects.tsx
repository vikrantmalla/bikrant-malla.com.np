import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback } from "react";
import { useFormManager } from "@/hooks/useFormManager";
import FormHeader from "./FormHeader";
import ItemsList from "./ItemsList";
import FormMessage from "./FormMessage";
import "./form.scss";

// Updated schema to match Prisma schema
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Subtitle is required"),
  images: z.string().min(1, "Images are required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  alt: z.string().min(1, "Alt text is required"),
  projectView: z.string().min(1, "Project View is required"),
  tools: z
    .string()
    .min(1, "Tools are required")
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : []
    ),
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

const ProjectsForm = () => {
  const {
    message,
    isEditing,
    currentItem: currentProject,
    isLoading,
    items: projects,
    selectedItemId: selectedProjectId,
    isFieldDisabled,
    handleEdit,
    handleCancel,
    handleDelete,
    handleCreateNew,
    handleSelectItem: handleSelectProject,
    onSubmit,
    resetForm,
    setCurrentItem: setCurrentProject,
    setIsEditing,
  } = useFormManager<ProjectData>("projects", "Project");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

  const handleFormSubmit = useCallback(async (data: any) => {
    // The schema validation will handle the tools transformation
    // No need for manual validation here since zodResolver handles it
    await onSubmit(data);
  }, [onSubmit]);

  const handleEditClick = useCallback((project: ProjectData) => {
    handleEdit(project);
    
    // Populate form with project data
    setValue("title", project.title);
    setValue("subTitle", project.subTitle);
    setValue("images", project.images);
    setValue("imageUrl", project.imageUrl);
    setValue("alt", project.alt);
    setValue("projectView", project.projectView);
    setValue("tools", project.tools.join(", "));
    setValue("platform", project.platform);
  }, [handleEdit, setValue]);

  const handleCancelClick = useCallback(() => {
    handleCancel();
    reset();
  }, [handleCancel, reset]);

  const handleCreateNewClick = useCallback(() => {
    handleCreateNew();
    reset();
  }, [handleCreateNew, reset]);

  const handleSelectProjectClick = useCallback((projectId: string) => {
    handleSelectProject(projectId);
    const project = projects.find(
      (p: ProjectData) => p.id === projectId
    );
    if (project) {
      // Populate form for viewing
      setValue("title", project.title);
      setValue("subTitle", project.subTitle);
      setValue("images", project.images);
      setValue("imageUrl", project.imageUrl);
      setValue("alt", project.alt);
      setValue("projectView", project.projectView);
      setValue("tools", project.tools.join(", "));
      setValue("platform", project.platform);
    }
  }, [projects, handleSelectProject, setValue]);

  const renderProject = useCallback((project: ProjectData) => (
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
  ), []);

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
        onEdit={() => currentProject && handleEditClick(currentProject)}
        onDelete={() => currentProject && handleDelete(currentProject.id)}
        onCreateNew={handleCreateNewClick}
        itemName="Project"
      />

      <ItemsList
        items={projects}
        selectedItemId={selectedProjectId}
        onSelectItem={handleSelectProjectClick}
        renderItem={renderProject}
        title="Existing Projects"
        itemName="Project"
      />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="form-layout">
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
          <label htmlFor="platform" className="form-label form-label--required">
            Platform
          </label>
          <input
            {...register("platform")}
            placeholder="e.g., Web, Mobile, Desktop"
            className="form-input"
            disabled={isFieldDisabled()}
          />
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
              onClick={handleCancelClick}
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
