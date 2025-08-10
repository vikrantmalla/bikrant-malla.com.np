import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

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
    phone: z.string().optional(),
    linkedIn: z.string().url().optional().or(z.literal("")),
    gitHub: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => data.email === data.ownerEmail, {
    message: "Owner Email must match Email",
    path: ["ownerEmail"],
  });

const PortfolioForm = () => {
  const [message, setMessage] = useState({ text: "", isError: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
      phone: "",
      linkedIn: "",
      gitHub: "",
      facebook: "",
      instagram: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ text: result.message, isError: false });
        reset();
      } else {
        setMessage({
          text: result.error || "Failed to create portfolio",
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while submitting the form",
        isError: true,
      });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Portfolio</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name" style={styles.label}>
            Full Name *
          </label>
          <input {...register("name")} />
          {errors.name && (
            <span style={styles.error}>{errors.name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="jobTitle" style={styles.label}>
            Job Title *
          </label>
          <input {...register("jobTitle")} />
          {errors.jobTitle && (
            <span style={styles.error}>{errors.jobTitle.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="aboutDescription1" style={styles.label}>
            About Description 1 *
          </label>
          <textarea {...register("aboutDescription1")} />
          {errors.aboutDescription1 && (
            <span style={styles.error}>{errors.aboutDescription1.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="aboutDescription2" style={styles.label}>
            About Description 2
          </label>
          <textarea {...register("aboutDescription2")} />
        </div>

        <div>
          <label htmlFor="skills" style={styles.label}>
            Skills (comma-separated)
          </label>
          <input
            {...register("skills")}
            placeholder="e.g., JavaScript, Python, React"
          />
        </div>

        <div>
          <label htmlFor="email" style={styles.label}>
            Email *
          </label>
          <input {...register("email")} type="email" />
          {errors.email && (
            <span style={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="ownerEmail" style={styles.label}>
            Owner Email *
          </label>
          <input {...register("ownerEmail")} type="email" />
          {errors.ownerEmail && (
            <span style={styles.error}>{errors.ownerEmail.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="phone" style={styles.label}>
            Phone
          </label>
          <input {...register("phone")} type="tel" />
        </div>

        <div>
          <label htmlFor="linkedIn" style={styles.label}>
            LinkedIn URL
          </label>
          <input {...register("linkedIn")} type="url" />
          {errors.linkedIn && (
            <span style={styles.error}>{errors.linkedIn.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="gitHub" style={styles.label}>
            GitHub URL
          </label>
          <input {...register("gitHub")} type="url" />
          {errors.gitHub && (
            <span style={styles.error}>{errors.gitHub.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="facebook" style={styles.label}>
            Facebook URL
          </label>
          <input {...register("facebook")} type="url" />
          {errors.facebook && (
            <span style={styles.error}>{errors.facebook.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="instagram" style={styles.label}>
            Instagram URL
          </label>
          <input {...register("instagram")} type="url" />
          {errors.instagram && (
            <span style={styles.error}>{errors.instagram.message}</span>
          )}
        </div>

        <button type="submit" style={styles.button}>
          Create Portfolio
        </button>
      </form>

      {message.text && (
        <div
          style={message.isError ? styles.errorMessage : styles.successMessage}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    height: "100px",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "fit-content",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  errorMessage: {
    color: "red",
    marginTop: "10px",
  },
  successMessage: {
    color: "green",
    marginTop: "10px",
  },
};

export default PortfolioForm;
