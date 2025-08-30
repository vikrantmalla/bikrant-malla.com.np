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
  className = "",
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
      className={`${className} ${isLoading ? "loading" : ""}`}
      onClick={handleLogout}
      postLogoutRedirectURL={kindeConfig.defaultLogoutRedirect}
    >
      {isLoading ? (
        <div className="loading-content">
          <div className="loading-spinner"></div>
          Logging out...
        </div>
      ) : (
        children
      )}
    </LogoutLink>
  );
} 