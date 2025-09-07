import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import FormHeader from "../dashboard/FormHeader";
import FormMessage from "../dashboard/FormMessage";
import "./form.scss";
import {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/app/dashboard/actions";
import { PortfolioDetails } from "@/types/data";

// Updated schema to match Prisma schema
const portfolioSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    jobTitle: z.string().min(1, "Job Title is required"),
    aboutDescription1: z.string().min(1, "About Description 1 is required"),
    aboutDescription2: z.string().min(1, "About Description 2 is required"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    ownerEmail: z
      .string()
      .email("Invalid owner email address")
      .min(1, "Owner Email is required"),
    linkedIn: z
      .string()
      .url("Invalid LinkedIn URL")
      .min(1, "LinkedIn URL is required"),
    gitHub: z
      .string()
      .url("Invalid GitHub URL")
      .min(1, "GitHub URL is required"),
    facebook: z
      .string()
      .url("Invalid Facebook URL")
      .min(1, "Facebook URL is required"),
    instagram: z
      .string()
      .url("Invalid Instagram URL")
      .min(1, "Instagram URL is required"),
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

interface FormMessageType {
  text: string;
  isError: boolean;
}

interface PortfolioFormProps {
  portfolioData?: PortfolioDetails | null;
}

const PortfolioForm = ({ portfolioData }: PortfolioFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<FormMessageType>({
    text: "",
    isError: false,
  });
  const [currentPortfolio, setCurrentPortfolio] =
    useState<PortfolioData | null>(null);
  const [techOptions, setTechOptions] = useState<Array<{ id: string; name: string; category: string }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      aboutDescription1: "",
      aboutDescription2: "",
      skills: [],
      email: "",
      ownerEmail: "",
      linkedIn: "",
      gitHub: "",
      facebook: "",
      instagram: "",
    },
  });

  // Watch skills field to handle checkbox selection
  const skillsValue = watch("skills");

  // Load existing portfolio data from props when component mounts or data changes
  useEffect(() => {
    if (portfolioData && portfolioData.id) {
      setCurrentPortfolio(portfolioData as PortfolioData);
      setIsEditing(false); // Start in view mode

      // Populate form with existing data
      setValue("name", portfolioData.name || "");
      setValue("jobTitle", portfolioData.jobTitle || "");
      setValue("aboutDescription1", portfolioData.aboutDescription1 || "");
      setValue("aboutDescription2", portfolioData.aboutDescription2 || "");
      setValue("skills", portfolioData.skills || []);
      setValue("email", portfolioData.email || "");
      setValue("ownerEmail", portfolioData.ownerEmail || "");
      setValue("linkedIn", portfolioData.linkedIn || "");
      setValue("gitHub", portfolioData.gitHub || "");
      setValue("facebook", portfolioData.facebook || "");
      setValue("instagram", portfolioData.instagram || "");
    } else {
      // No existing portfolio, start in create mode
      setCurrentPortfolio(null);
      setIsEditing(true);
      reset();
    }
  }, [portfolioData, setValue, reset]);

  // Load tech options from API
  useEffect(() => {
    const loadTechOptions = async () => {
      try {
        const { getTechOptions } = await import('@/app/dashboard/actions');
        const result = await getTechOptions();
        
        if (result.success) {
          setTechOptions(result.data);
        }
      } catch (error) {
        console.error('Failed to load tech options:', error);
      }
    };

    loadTechOptions();
  }, []);

  // Server action handlers
  const handleCreatePortfolio = async (data: any) => {
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          formData.append(key, value.join(","));
        } else {
          formData.append(key, value as string);
        }
      });

      const result = await createPortfolio(formData);
      if (result.success) {
        setMessage({ text: "Portfolio created successfully!", isError: false });
        setCurrentPortfolio(result.data);
        setIsEditing(false);
        return { success: true, data: result.data };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to create portfolio", isError: true });
      return { success: false, error: "Failed to create portfolio" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePortfolio = async (data: any) => {
    if (!currentPortfolio?.id)
      return { success: false, error: "No portfolio ID" };

    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          formData.append(key, value.join(","));
        } else {
          formData.append(key, value as string);
        }
      });

      const result = await updatePortfolio(currentPortfolio.id, formData);
      if (result.success) {
        setMessage({ text: "Portfolio updated successfully!", isError: false });
        setCurrentPortfolio(result.data);
        setIsEditing(false);
        return { success: true, data: result.data };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to update portfolio", isError: true });
      return { success: false, error: "Failed to update portfolio" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePortfolio = async () => {
    if (!currentPortfolio?.id)
      return { success: false, error: "No portfolio ID" };

    if (!confirm("Are you sure you want to delete this portfolio?")) {
      return { success: false, error: "Deletion cancelled" };
    }

    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const result = await deletePortfolio(currentPortfolio.id);
      if (result.success) {
        setMessage({ text: "Portfolio deleted successfully!", isError: false });
        setCurrentPortfolio(null);
        reset();
        return { success: true };
      } else {
        setMessage({ text: `Error: ${result.error}`, isError: true });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setMessage({ text: "Failed to delete portfolio", isError: true });
      return { success: false, error: "Failed to delete portfolio" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ text: "", isError: false });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ text: "", isError: false });

    // Reset form to current portfolio data
    if (currentPortfolio) {
      setValue("name", currentPortfolio.name || "");
      setValue("jobTitle", currentPortfolio.jobTitle || "");
      setValue("aboutDescription1", currentPortfolio.aboutDescription1 || "");
      setValue("aboutDescription2", currentPortfolio.aboutDescription2 || "");
      setValue("skills", currentPortfolio.skills || []);
      setValue("email", currentPortfolio.email || "");
      setValue("ownerEmail", currentPortfolio.ownerEmail || "");
      setValue("linkedIn", currentPortfolio.linkedIn || "");
      setValue("gitHub", currentPortfolio.gitHub || "");
      setValue("facebook", currentPortfolio.facebook || "");
      setValue("instagram", currentPortfolio.instagram || "");
    }
  };

  const handleCreateNew = () => {
    setCurrentPortfolio(null);
    setIsEditing(true);
    setMessage({ text: "", isError: false });
    reset();
  };

  // Form submission handler
  const handleFormSubmit = async (data: any) => {
    if (isEditing) {
      if (currentPortfolio) {
        return await handleUpdatePortfolio(data);
      } else {
        return await handleCreatePortfolio(data);
      }
    } else {
      return await handleCreatePortfolio(data);
    }
  };

  const getTitle = () => {
    if (isEditing) return "Edit Portfolio";
    if (currentPortfolio) return "View Portfolio";
    return "Create Portfolio";
  };

  const isFieldDisabled = () => {
    return !isEditing || isLoading;
  };

  return (
    <div className="form-container form-container--small">
      <FormHeader
        title={getTitle()}
        isEditing={isEditing}
        hasCurrentItem={!!currentPortfolio}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeletePortfolio}
        onCreateNew={handleCreateNew}
        itemName="Portfolio"
      />

      <FormMessage message={message} />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="form-layout">
        <div className="form-group">
          <label htmlFor="name" className="form-label form-label--required">
            Full Name
          </label>
          <input
            {...register("name")}
            className="form-input"
            type="text"
            id="name"
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
            type="text"
            id="jobTitle"
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
            id="aboutDescription1"
            disabled={isFieldDisabled()}
            rows={3}
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
            id="aboutDescription2"
            disabled={isFieldDisabled()}
            rows={3}
          />
          {errors.aboutDescription2 && (
            <span className="form-error">
              {errors.aboutDescription2.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label form-label--required">Skills (Max 10)</label>
          <div className="tools-checkboxes">
            {techOptions.length > 0 ? (
              techOptions.map((option) => {
                const currentSkills = Array.isArray(skillsValue) ? skillsValue : [];
                const isSelected = currentSkills.includes(option.name);
                const isLimitReached = currentSkills.length >= 10;
                const isDisabled = isFieldDisabled() || (!isSelected && isLimitReached);
                
                return (
                  <label key={option.id} className="tool-checkbox">
                    <input
                      type="checkbox"
                      value={option.name}
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue("skills", [...currentSkills, option.name]);
                        } else {
                          setValue(
                            "skills",
                            currentSkills.filter((s) => s !== option.name)
                          );
                        }
                      }}
                      disabled={isDisabled}
                      className="form-checkbox"
                    />
                    <span className="tool-label">{option.name}</span>
                  </label>
                );
              })
            ) : (
              <div className="loading-tools">Loading skills...</div>
            )}
          </div>
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
            className="form-input"
            type="email"
            id="email"
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
            className="form-input"
            type="email"
            id="ownerEmail"
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
            className="form-input"
            type="url"
            id="linkedIn"
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
            className="form-input"
            type="url"
            id="gitHub"
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
            className="form-input"
            type="url"
            id="facebook"
            disabled={isFieldDisabled()}
          />
          {errors.facebook && (
            <span className="form-error">{errors.facebook.message}</span>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="instagram"
            className="form-label form-label--required"
          >
            Instagram URL
          </label>
          <input
            {...register("instagram")}
            className="form-input"
            type="url"
            id="instagram"
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
    </div>
  );
};

export default PortfolioForm;
