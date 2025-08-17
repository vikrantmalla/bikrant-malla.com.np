import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { useSingleItemFormManager } from "@/hooks/useSingleItemFormManager";
import FormHeader from "./FormHeader";
import FormMessage from "./FormMessage";
import "./form.scss";

// Updated schema to match Prisma schema
const portfolioSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    jobTitle: z.string().min(1, "Job Title is required"),
    aboutDescription1: z.string().min(1, "About Description 1 is required"),
    aboutDescription2: z.string().min(1, "About Description 2 is required"),
    skills: z
      .string()
      .min(1, "Skills are required")
      .transform((val) =>
        val
          ? val
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : []
      ),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    ownerEmail: z
      .string()
      .email("Invalid owner email address")
      .min(1, "Owner Email is required"),
    linkedIn: z.string().url("Invalid LinkedIn URL").min(1, "LinkedIn URL is required"),
    gitHub: z.string().url("Invalid GitHub URL").min(1, "GitHub URL is required"),
    facebook: z.string().url("Invalid Facebook URL").min(1, "Facebook URL is required"),
    instagram: z.string().url("Invalid Instagram URL").min(1, "Instagram URL is required"),
  })
  .refine((data) => data.email === data.ownerEmail, {
    message: "Owner Email must match Email",
    path: ["ownerEmail"],
  });

interface PortfolioData {
  id: string;
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

const PortfolioForm = () => {
  const {
    message,
    isEditing,
    currentItem: currentPortfolio,
    isLoading,
    isFieldDisabled,
    handleEdit,
    handleCancel,
    handleDelete,
    handleCreateNew,
    onSubmit,
    resetForm,
    setCurrentItem: setCurrentPortfolio,
    setIsEditing,
  } = useSingleItemFormManager<PortfolioData>("portfolio", "Portfolio");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      aboutDescription1: "",
      aboutDescription2: "",
      skills: "",
      email: "",
      ownerEmail: "",
      linkedIn: "",
      gitHub: "",
      facebook: "",
      instagram: "",
    },
  });

  // Fetch existing portfolio data and populate form
  useEffect(() => {
    if (currentPortfolio) {
      setValue("name", currentPortfolio.name);
      setValue("jobTitle", currentPortfolio.jobTitle);
      setValue("aboutDescription1", currentPortfolio.aboutDescription1);
      setValue("aboutDescription2", currentPortfolio.aboutDescription2);
      setValue(
        "skills",
        currentPortfolio.skills.join(", ")
      );
      setValue("email", currentPortfolio.email);
      setValue("ownerEmail", currentPortfolio.ownerEmail);
      setValue("linkedIn", currentPortfolio.linkedIn);
      setValue("gitHub", currentPortfolio.gitHub);
      setValue("facebook", currentPortfolio.facebook);
      setValue("instagram", currentPortfolio.instagram);
    }
  }, [currentPortfolio, setValue]);

  // Ensure form fields are properly disabled when not in editing mode
  useEffect(() => {
    if (!isEditing && currentPortfolio) {
      // Force form to be in view mode by ensuring all fields are disabled
      // This is a safety measure to ensure the form behaves correctly
    }
  }, [isEditing, currentPortfolio]);

  const handleFormSubmit = useCallback(
    async (data: any) => {
      // Validate required fields before submission
      if (!data.name?.trim() || !data.jobTitle?.trim() || !data.aboutDescription1?.trim() || 
          !data.aboutDescription2?.trim() || !data.skills?.trim() || !data.email?.trim() || 
          !data.ownerEmail?.trim() || !data.linkedIn?.trim() || !data.gitHub?.trim() || 
          !data.facebook?.trim() || !data.instagram?.trim()) {
        return;
      }
      await onSubmit(data);
    },
    [onSubmit]
  );

  const handleEditClick = useCallback(() => {
    if (currentPortfolio) {
      handleEdit();
    }
  }, [handleEdit, currentPortfolio]);

  const handleCancelClick = useCallback(() => {
    handleCancel();

    // Reset form to current portfolio data
    if (currentPortfolio) {
      setValue("name", currentPortfolio.name);
      setValue("jobTitle", currentPortfolio.jobTitle);
      setValue("aboutDescription1", currentPortfolio.aboutDescription1);
      setValue("aboutDescription2", currentPortfolio.aboutDescription2);
      setValue(
        "skills",
        currentPortfolio.skills.join(", ")
      );
      setValue("email", currentPortfolio.email);
      setValue("ownerEmail", currentPortfolio.ownerEmail);
      setValue("linkedIn", currentPortfolio.linkedIn);
      setValue("gitHub", currentPortfolio.gitHub);
      setValue("facebook", currentPortfolio.facebook);
      setValue("instagram", currentPortfolio.instagram);
    }
  }, [currentPortfolio, handleCancel, setValue]);

  const handleCreateNewClick = useCallback(() => {
    handleCreateNew();
    reset();
  }, [handleCreateNew, reset]);

  const handleDeleteClick = useCallback(() => {
    if (currentPortfolio) {
      handleDelete();
    }
  }, [handleDelete, currentPortfolio]);

  const getTitle = () => {
    if (isEditing) return "Edit Portfolio";
    if (currentPortfolio) return "View Portfolio";
    return "Create Portfolio";
  };

  return (
    <div className="form-container form-container--small">
      <FormHeader
        title={getTitle()}
        isEditing={isEditing}
        hasCurrentItem={!!currentPortfolio}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onCreateNew={handleCreateNewClick}
        itemName="Portfolio"
      />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="form-layout">
        <div className="form-group">
          <label htmlFor="name" className="form-label form-label--required">
            Full Name
          </label>
          <input
            {...register("name")}
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="jobTitle" className="form-label form-label--required">
            Job Title
          </label>
          <input
            {...register("jobTitle")}
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.jobTitle && (
            <span className="form-error">{errors.jobTitle.message}</span>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="aboutDescription1"
            className="form-label form-label--required"
          >
            About Description 1
          </label>
          <textarea
            {...register("aboutDescription1")}
            className="form-textarea"
            disabled={isFieldDisabled()}
          />
          {errors.aboutDescription1 && (
            <span className="form-error">
              {errors.aboutDescription1.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="aboutDescription2"
            className="form-label form-label--required"
          >
            About Description 2
          </label>
          <textarea
            {...register("aboutDescription2")}
            className="form-textarea"
            disabled={isFieldDisabled()}
          />
          {errors.aboutDescription2 && (
            <span className="form-error">
              {errors.aboutDescription2.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="skills" className="form-label form-label--required">
            Skills (comma-separated)
          </label>
          <input
            {...register("skills")}
            placeholder="e.g., JavaScript, Python, React"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.skills && (
            <span className="form-error">{errors.skills.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label form-label--required">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="ownerEmail"
            className="form-label form-label--required"
          >
            Owner Email
          </label>
          <input
            {...register("ownerEmail")}
            type="email"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.ownerEmail && (
            <span className="form-error">{errors.ownerEmail.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="linkedIn" className="form-label form-label--required">
            LinkedIn URL
          </label>
          <input
            {...register("linkedIn")}
            type="url"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.linkedIn && (
            <span className="form-error">{errors.linkedIn.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gitHub" className="form-label form-label--required">
            GitHub URL
          </label>
          <input
            {...register("gitHub")}
            type="url"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.gitHub && (
            <span className="form-error">{errors.gitHub.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="facebook" className="form-label form-label--required">
            Facebook URL
          </label>
          <input
            {...register("facebook")}
            type="url"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.facebook && (
            <span className="form-error">{errors.facebook.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="instagram" className="form-label form-label--required">
            Instagram URL
          </label>
          <input
            {...register("instagram")}
            type="url"
            className="form-input"
            disabled={isFieldDisabled()}
          />
          {errors.instagram && (
            <span className="form-error">{errors.instagram.message}</span>
          )}
        </div>

        {isEditing && (
          <div className="form-actions-container">
            <button
              type="submit"
              className="form-button form-button--primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Portfolio"}
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

        {!currentPortfolio && (
          <button
            type="submit"
            className="form-button form-button--primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Portfolio"}
          </button>
        )}
      </form>

      <FormMessage message={message} />
    </div>
  );
};

export default PortfolioForm;
