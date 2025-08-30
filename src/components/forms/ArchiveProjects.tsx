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

const ArchiveProjectsForm = () => {
  const {
    message,
    isEditing,
    currentItem: currentArchiveProject,
    isLoading,
    items: archiveProjects,
    selectedItemId: selectedArchiveProjectId,
    isFieldDisabled,
    handleEdit,
    handleCancel,
    handleDelete,
    handleCreateNew,
    handleSelectItem: handleSelectArchiveProject,
    onSubmit,
    resetForm,
    refreshItems,
    setCurrentItem: setCurrentArchiveProject,
    setIsEditing,
  } = useFormManager<ArchiveProjectData>("archiveProjects", "Archive Project");

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
      build: [],
    },
  });

  const handleFormSubmit = useCallback(async (data: any) => {
    // Validate required fields before submission
    if (!data.title?.trim() || !data.year || !data.projectView?.trim() || !data.viewCode?.trim()) {
      return;
    }
    // Note: build field is optional, so no validation needed
    await onSubmit(data);
  }, [onSubmit]);

  const handleEditClick = useCallback((archiveProject: ArchiveProjectData) => {
    handleEdit(archiveProject);
    
    // Populate form with archive project data
    setValue("title", archiveProject.title);
    setValue("year", archiveProject.year.toString());
    setValue("isNew", archiveProject.isNew);
    setValue("projectView", archiveProject.projectView);
    setValue("viewCode", archiveProject.viewCode);
    setValue(
      "build",
      archiveProject.build || []
    );
  }, [handleEdit, setValue]);

  const handleCancelClick = useCallback(() => {
    handleCancel();
    reset();
  }, [handleCancel, reset]);

  const handleCreateNewClick = useCallback(() => {
    handleCreateNew();
    reset();
  }, [handleCreateNew, reset]);

  const handleSelectArchiveProjectClick = useCallback((archiveProjectId: string) => {
    handleSelectArchiveProject(archiveProjectId);
    const archiveProject = archiveProjects.find(
      (p: ArchiveProjectData) => p.id === archiveProjectId
    );
    if (archiveProject) {
      // Populate form for viewing
      setValue("title", archiveProject.title);
      setValue("year", archiveProject.year.toString());
      setValue("isNew", archiveProject.isNew);
      setValue("projectView", archiveProject.projectView);
      setValue("viewCode", archiveProject.viewCode);
      setValue(
        "build",
        archiveProject.build || []
      );
    }
  }, [archiveProjects, handleSelectArchiveProject, setValue]);

  const renderArchiveProject = useCallback((archiveProject: ArchiveProjectData) => (
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
  ), []);

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
        onEdit={() => currentArchiveProject && handleEditClick(currentArchiveProject)}
        onDelete={() => currentArchiveProject && handleDelete(currentArchiveProject.id)}
        onCreateNew={handleCreateNewClick}
        onRefresh={refreshItems}
        itemName="Archive Project"
      />

      <ItemsList
        items={archiveProjects}
        selectedItemId={selectedArchiveProjectId}
        onSelectItem={handleSelectArchiveProjectClick}
        renderItem={renderArchiveProject}
        title="Existing Archive Projects"
        itemName="Archive Project"
        isLoading={isLoading}
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
                  {...register("build")}
                  disabled={isFieldDisabled()}
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
              onClick={handleCancelClick}
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
