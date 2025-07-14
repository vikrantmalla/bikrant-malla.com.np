"use client";
import { useRouter } from "next/navigation";
import { buildLoginUrl } from "@/lib/kinde-config";

interface CustomLoginLinkProps {
  className?: string;
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function CustomLoginLink({ 
  className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors",
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