"use client";
import { useState } from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useRouter } from "next/navigation";
import { kindeConfig } from "@/lib/kinde-config";

interface CustomLogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CustomLogoutButton({ 
  className = "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors",
  children = "Log Out"
}: CustomLogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    // The LogoutLink component will handle the actual logout
    // After logout, it will redirect to the home page
  };

  return (
    <LogoutLink
      className={`${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleLogout}
      postLogoutRedirectURL={kindeConfig.defaultLogoutRedirect}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Logging out...
        </div>
      ) : (
        children
      )}
    </LogoutLink>
  );
} 