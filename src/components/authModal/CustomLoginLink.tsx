"use client";
import { useRouter } from "next/navigation";

interface CustomLoginLinkProps {
  className?: string;
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function CustomLoginLink({ 
  className = "",
  children = "Sign In",
  redirectTo = "/dashboard"
}: CustomLoginLinkProps) {
  const router = useRouter();

  const handleLogin = () => {
    const loginUrl = `/login?redirect=${encodeURIComponent(redirectTo)}`;
    router.push(loginUrl);
  };

  return (
    <button
      className={className}
      onClick={handleLogin}
    >
      {children}
    </button>
  );
} 