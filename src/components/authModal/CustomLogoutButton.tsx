"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface CustomLogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CustomLogoutButton({ 
  className = "",
  children = "Log Out"
}: CustomLogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`${className} ${isLoading ? "loading" : ""}`}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="loading-content">
          <div className="loading-spinner"></div>
          Logging out...
        </div>
      ) : (
        children
      )}
    </button>
  );
} 