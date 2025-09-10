"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { HiEye, HiEyeOff } from "react-icons/hi";
import "./reset-password.scss";

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  } = useForm<ResetPasswordData>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    }
  });

  const password = watch("password");

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }, [token, email]);

  const onSubmit = async (data: ResetPasswordData) => {
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = responseData.redirectUrl || '/dashboard?setup=complete';
        }, 2000);
      } else {
        setError(responseData.error || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="reset-password-page__loading">
        <div className="reset-password-page__loading-container">
          <div className="reset-password-page__loading-spinner"></div>
          <p className="reset-password-page__loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-page__container">
          <div className="reset-password-page__success">
            <div className="reset-password-page__success-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2>Password Set Successfully!</h2>
            <p>Your password has been updated successfully.</p>
            <p>Redirecting you to complete your portfolio setup...</p>
            
            <div className="reset-password-page__actions">
              <Link href="/dashboard?setup=complete" className="reset-password-page__button">
                Go to Portfolio Setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-page__container">
        <div className="reset-password-page__header">
          <h1>Set Your Password</h1>
          <p>Please enter a new password for your account</p>
          {email && <p className="reset-password-page__email">Account: {email}</p>}
        </div>
        
        <form className="reset-password-page__form" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="reset-password-page__error">
              <svg className="reset-password-page__error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="reset-password-page__error-message">{error}</p>
            </div>
          )}

          <div className="reset-password-page__fields">
            <div className="reset-password-page__field">
              <label htmlFor="password">New Password *</label>
              <div className="reset-password-page__password-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
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
                  className="reset-password-page__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <HiEyeOff className="reset-password-page__password-icon" />
                  ) : (
                    <HiEye className="reset-password-page__password-icon" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="reset-password-page__field-error">{errors.password.message}</span>
              )}
            </div>

            <div className="reset-password-page__field">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="reset-password-page__password-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match"
                  })}
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="reset-password-page__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <HiEyeOff className="reset-password-page__password-icon" />
                  ) : (
                    <HiEye className="reset-password-page__password-icon" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="reset-password-page__field-error">{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`reset-password-page__submit ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <div className="reset-password-page__submit-loading">
                <div className="spinner"></div>
                Setting password...
              </div>
            ) : (
              "Set Password"
            )}
          </button>

          <div className="reset-password-page__info">
            <p>Password must be at least 8 characters long.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
