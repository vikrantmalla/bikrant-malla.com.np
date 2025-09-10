"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HiEye, HiEyeOff } from "react-icons/hi";
import "./login.scss";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // Get the redirect URL from query params
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (isAuthenticated && !isLoading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  const onSubmit = async (data: LoginData) => {
    setError(null);

    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        // Trigger authentication check to update state
        // This will check server-side cookies and update isAuthenticated
        window.location.href = redirectTo;
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="login-page__loading">
        <div className="login-page__loading-container">
          <div className="login-page__loading-spinner"></div>
          <p className="login-page__loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="login-page__loading">
        <div className="login-page__loading-container">
          <div className="login-page__loading-spinner"></div>
          <p className="login-page__loading-text">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h2>Sign in to your account</h2>
          <p>Access your portfolio dashboard</p>
        </div>
        
        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="login-page__error">
              <svg className="login-page__error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="login-page__error-message">{error}</p>
            </div>
          )}

          <div className="login-page__fields">
            <div className="login-page__field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
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
                <span className="login-page__field-error">{errors.email.message}</span>
              )}
            </div>

            <div className="login-page__field">
              <label htmlFor="password">Password</label>
              <div className="login-page__password-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required"
                  })}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="login-page__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <HiEyeOff className="login-page__password-icon" />
                  ) : (
                    <HiEye className="login-page__password-icon" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="login-page__field-error">{errors.password.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`login-page__submit ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <div className="login-page__submit-loading">
                <div className="spinner"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="login-page__back-link">
            <Link href="/">Back to Portfolio</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
