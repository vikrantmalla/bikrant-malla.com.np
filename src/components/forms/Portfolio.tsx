import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { clientApi } from "@/service/apiService";
import "./form.scss";

const portfolioSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    jobTitle: z.string().min(1, "Job Title is required"),
    aboutDescription1: z.string().min(1, "About Description 1 is required"),
    aboutDescription2: z.string().optional(),
    skills: z
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
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    ownerEmail: z
      .string()
      .email("Invalid owner email address")
      .min(1, "Owner Email is required"),
    linkedIn: z.string().url().optional().or(z.literal("")),
    gitHub: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
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
  aboutDescription2?: string;
  skills: string[];
  email: string;
  ownerEmail: string;
  linkedIn?: string;
  gitHub?: string;
  facebook?: string;
  instagram?: string;
}

const PortfolioForm = () => {
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] =
    useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  // Helper function to determine if fields should be disabled
  const isFieldDisabled = () => !isEditing && !!currentPortfolio;

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

  // Fetch existing portfolio data
  useEffect(() => {
    if (hasFetched.current) return;
    
    const fetchPortfolio = async () => {
      try {
        const portfolio = await clientApi.portfolio.get();
        setCurrentPortfolio(portfolio);
        // Populate form with existing data
        setValue("name", portfolio.name);
        setValue("jobTitle", portfolio.jobTitle);
        setValue("aboutDescription1", portfolio.aboutDescription1);
        setValue("aboutDescription2", portfolio.aboutDescription2 || "");
        setValue(
          "skills",
          portfolio.skills ? portfolio.skills.join(", ") : ""
        );
        setValue("email", portfolio.email);
        setValue("ownerEmail", portfolio.ownerEmail);
        setValue("linkedIn", portfolio.linkedIn || "");
        setValue("gitHub", portfolio.gitHub || "");
        setValue("facebook", portfolio.facebook || "");
        setValue("instagram", portfolio.instagram || "");
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        hasFetched.current = true;
      }
    };

    fetchPortfolio();
  }, [setValue]); // Remove setValue from dependencies to prevent infinite loops

  const onSubmit = useCallback(async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      let result;

      if (isEditing && currentPortfolio) {
        // Update existing portfolio
        result = await clientApi.portfolio.update(currentPortfolio.id, data);
      } else {
        // Create new portfolio
        result = await clientApi.portfolio.create(data);
      }

      if (result) {
        setMessage({
          text: isEditing
            ? "Portfolio updated successfully!"
            : "Portfolio created successfully!",
          isError: false,
        });

        if (!isEditing) {
          // If creating new, reset form
          reset();
        }

        // Refresh portfolio data
        try {
          const portfolio = await clientApi.portfolio.get();
          setCurrentPortfolio(portfolio);
        } catch (error) {
          console.error("Error refreshing portfolio:", error);
        }
      } else {
        setMessage({
          text: `Failed to ${isEditing ? "update" : "create"} portfolio`,
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
  }, [isEditing, currentPortfolio, reset]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setMessage({ text: "", isError: false });
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setMessage({ text: "", isError: false });

    // Reset form to current portfolio data
    if (currentPortfolio) {
      setValue("name", currentPortfolio.name);
      setValue("jobTitle", currentPortfolio.jobTitle);
      setValue("aboutDescription1", currentPortfolio.aboutDescription1);
      setValue("aboutDescription2", currentPortfolio.aboutDescription2);
      setValue("skills", currentPortfolio.skills ? currentPortfolio.skills.join(", ") : "");
      setValue("email", currentPortfolio.email);
      setValue("ownerEmail", currentPortfolio.ownerEmail);
      setValue("linkedIn", currentPortfolio.linkedIn);
      setValue("gitHub", currentPortfolio.gitHub);
      setValue("facebook", currentPortfolio.facebook);
      setValue("instagram", currentPortfolio.instagram);
    }
  }, [currentPortfolio, setValue]);

  const handleDelete = useCallback(async () => {
    if (!currentPortfolio) return;

    if (
      !confirm(
        "Are you sure you want to delete this portfolio? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const result = await clientApi.portfolio.delete(currentPortfolio.id);

      if (result) {
        setMessage({ text: "Portfolio deleted successfully!", isError: false });
        setCurrentPortfolio(null);
        reset();
        setIsEditing(false);
      } else {
        setMessage({
          text: "Failed to delete portfolio",
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while deleting the portfolio",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPortfolio, reset]);

  const handleCreateNew = useCallback(() => {
    setIsEditing(false);
    setCurrentPortfolio(null);
    reset();
    setMessage({ text: "", isError: false });
  }, [reset]);

  return (
    <div className="form-container form-container--small">
      <div className="form-header">
        <h1 className="form-title">
          {isEditing
            ? "Edit Portfolio"
            : currentPortfolio
            ? "View Portfolio"
            : "Create Portfolio"}
        </h1>

        {currentPortfolio && !isEditing && (
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCreateNew}
              className="form-button form-button--secondary"
              title="Create New Portfolio"
            >
              <FaPlus />
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="form-button form-button--secondary"
              title="Edit Portfolio"
            >
              <FaEdit />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="form-button form-button--danger"
              disabled={isLoading}
              title="Delete Portfolio"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-layout">
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
          <label htmlFor="aboutDescription2" className="form-label">
            About Description 2
          </label>
          <textarea
            {...register("aboutDescription2")}
            className="form-textarea"
            disabled={isFieldDisabled()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="skills" className="form-label">
            Skills (comma-separated)
          </label>
          <input
            {...register("skills")}
            placeholder="e.g., JavaScript, Python, React"
            className="form-input"
            disabled={isFieldDisabled()}
          />
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
          <label htmlFor="linkedIn" className="form-label">
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
          <label htmlFor="gitHub" className="form-label">
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
          <label htmlFor="facebook" className="form-label">
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
          <label htmlFor="instagram" className="form-label">
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
              onClick={handleCancel}
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

export default PortfolioForm;
