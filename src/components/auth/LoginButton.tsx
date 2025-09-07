"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import "./auth.scss";

interface LoginButtonProps {
  className?: string;
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function LoginButton({ 
  className = "", 
  children, 
  redirectTo = "/dashboard" 
}: LoginButtonProps) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="user-info">
        <span>
          Welcome, {user.name || user.email}
        </span>
        <Link
          href="/dashboard"
          className="login-btn"
        >
          Dashboard
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
      className={`${className} login-btn`}
    >
      {children || "Sign In"}
    </Link>
  );
}
