"use client";
import { useRouter } from "next/navigation";
import { buildLoginUrl } from "@/lib/kinde-config";

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
    const loginUrl = buildLoginUrl(redirectTo);
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