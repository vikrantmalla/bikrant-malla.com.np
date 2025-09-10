"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { HiCheckCircle, HiXCircle, HiEye, HiEyeOff } from "react-icons/hi";
import "./setup.scss";

interface SetupData {
  email: string;
  name: string;
  portfolioName: string;
  jobTitle: string;
  password: string;
  confirmPassword: string;
}

export default function SetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<SetupData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      portfolioName: "",
      jobTitle: "",
      password: "",
      confirmPassword: "",
    }
  });

  const password = watch("password");

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch('/api/setup');
        const data = await response.json();
        
        if (data.isInitialized) {
          // System is already initialized, redirect to login
          router.push('/login');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking system status:', error);
        setError('Failed to check system status');
        setIsLoading(false);
      }
    };

    checkSystemStatus();
  }, [router]);

  const onSubmit = async (data: SetupData) => {
    setError(null);

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(responseData.error || 'Setup failed. Please try again.');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="setup-page__loading">
        <div className="setup-page__loading-container">
          <div className="setup-page__loading-spinner"></div>
          <p className="setup-page__loading-text">Checking system status...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="setup-page">
        <div className="setup-page__container">
          <div className="setup-page__success">
            <div className="setup-page__success-icon">
              <HiCheckCircle />
            </div>
            <h2>Setup Complete!</h2>
            <p>Your portfolio system has been successfully initialized.</p>
            <p>You can now log in with your email and password.</p>
            
            <div className="setup-page__actions">
              <Link href="/login" className="setup-page__button">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-page">
      <div className="setup-page__container">
        <div className="setup-page__header">
          <h1>Welcome! Let&apos;s set up your portfolio</h1>
          <p>This will create your admin account and initialize your portfolio system.</p>
        </div>
        
        <form className="setup-page__form" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="setup-page__error">
              <HiXCircle className="setup-page__error-icon" />
              <p className="setup-page__error-message">{error}</p>
            </div>
          )}

          <div className="setup-page__fields">
            <div className="setup-page__field">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address"
                  }
                })}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="setup-page__field-error">{errors.email.message}</span>
              )}
            </div>

            <div className="setup-page__field">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  }
                })}
                className={errors.name ? "error" : ""}
              />
              {errors.name && (
                <span className="setup-page__field-error">{errors.name.message}</span>
              )}
            </div>

            <div className="setup-page__field">
              <label htmlFor="portfolioName">Portfolio Name *</label>
              <input
                id="portfolioName"
                type="text"
                placeholder="My Portfolio"
                {...register("portfolioName", {
                  required: "Portfolio name is required",
                  minLength: {
                    value: 2,
                    message: "Portfolio name must be at least 2 characters"
                  }
                })}
                className={errors.portfolioName ? "error" : ""}
              />
              {errors.portfolioName && (
                <span className="setup-page__field-error">{errors.portfolioName.message}</span>
              )}
            </div>

            <div className="setup-page__field">
              <label htmlFor="jobTitle">Job Title *</label>
              <input
                id="jobTitle"
                type="text"
                placeholder="Full Stack Developer"
                {...register("jobTitle", {
                  required: "Job title is required",
                  minLength: {
                    value: 2,
                    message: "Job title must be at least 2 characters"
                  }
                })}
                className={errors.jobTitle ? "error" : ""}
              />
              {errors.jobTitle && (
                <span className="setup-page__field-error">{errors.jobTitle.message}</span>
              )}
            </div>

            <div className="setup-page__field">
              <label htmlFor="password">Password *</label>
              <div className="setup-page__password-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="setup-page__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <HiEye className="setup-page__password-icon" />
                  ) : (
                    <HiEyeOff className="setup-page__password-icon" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="setup-page__field-error">{errors.password.message}</span>
              )}
            </div>

            <div className="setup-page__field">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="setup-page__password-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match"
                  })}
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="setup-page__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <HiEye className="setup-page__password-icon" />
                  ) : (
                    <HiEyeOff className="setup-page__password-icon" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="setup-page__field-error">{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`setup-page__submit ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <div className="setup-page__submit-loading">
                <div className="spinner"></div>
                Setting up...
              </div>
            ) : (
              "Initialize System"
            )}
          </button>

          <div className="setup-page__info">
            <p>After setup, you&apos;ll be able to log in and complete your portfolio.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
