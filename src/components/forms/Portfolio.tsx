import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import "./Portfolio.scss";

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
      const response = await fetch("/api/portfolio/create", {
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
    <div className="portfolio-form">
      <h1 className="portfolio-form__title">Create Portfolio</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="portfolio-form__form">
        <div className="portfolio-form__form-group">
          <label htmlFor="name" className="portfolio-form__label portfolio-form__label--required">
            Full Name
          </label>
          <input {...register("name")} className="portfolio-form__input" />
          {errors.name && (
            <span className="portfolio-form__error">{errors.name.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="jobTitle" className="portfolio-form__label portfolio-form__label--required">
            Job Title
          </label>
          <input {...register("jobTitle")} className="portfolio-form__input" />
          {errors.jobTitle && (
            <span className="portfolio-form__error">{errors.jobTitle.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="aboutDescription1" className="portfolio-form__label portfolio-form__label--required">
            About Description 1
          </label>
          <textarea {...register("aboutDescription1")} className="portfolio-form__textarea" />
          {errors.aboutDescription1 && (
            <span className="portfolio-form__error">{errors.aboutDescription1.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="aboutDescription2" className="portfolio-form__label">
            About Description 2
          </label>
          <textarea {...register("aboutDescription2")} className="portfolio-form__textarea" />
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="skills" className="portfolio-form__label">
            Skills (comma-separated)
          </label>
          <input
            {...register("skills")}
            placeholder="e.g., JavaScript, Python, React"
            className="portfolio-form__input"
          />
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="email" className="portfolio-form__label portfolio-form__label--required">
            Email
          </label>
          <input {...register("email")} type="email" className="portfolio-form__input" />
          {errors.email && (
            <span className="portfolio-form__error">{errors.email.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="ownerEmail" className="portfolio-form__label portfolio-form__label--required">
            Owner Email
          </label>
          <input {...register("ownerEmail")} type="email" className="portfolio-form__input" />
          {errors.ownerEmail && (
            <span className="portfolio-form__error">{errors.ownerEmail.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="phone" className="portfolio-form__label">
            Phone
          </label>
          <input {...register("phone")} type="tel" className="portfolio-form__input" />
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="linkedIn" className="portfolio-form__label">
            LinkedIn URL
          </label>
          <input {...register("linkedIn")} type="url" className="portfolio-form__input" />
          {errors.linkedIn && (
            <span className="portfolio-form__error">{errors.linkedIn.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="gitHub" className="portfolio-form__label">
            GitHub URL
          </label>
          <input {...register("gitHub")} type="url" className="portfolio-form__input" />
          {errors.gitHub && (
            <span className="portfolio-form__error">{errors.gitHub.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="facebook" className="portfolio-form__label">
            Facebook URL
          </label>
          <input {...register("facebook")} type="url" className="portfolio-form__input" />
          {errors.facebook && (
            <span className="portfolio-form__error">{errors.facebook.message}</span>
          )}
        </div>

        <div className="portfolio-form__form-group">
          <label htmlFor="instagram" className="portfolio-form__label">
            Instagram URL
          </label>
          <input {...register("instagram")} type="url" className="portfolio-form__input" />
          {errors.instagram && (
            <span className="portfolio-form__error">{errors.instagram.message}</span>
          )}
        </div>

        <button type="submit" className="portfolio-form__button">
          Create Portfolio
        </button>
      </form>

      {message.text && (
        <div
          className={`portfolio-form__message ${
            message.isError ? "portfolio-form__message--error" : "portfolio-form__message--success"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PortfolioForm;
