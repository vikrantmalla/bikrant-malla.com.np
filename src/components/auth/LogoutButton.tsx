"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import "./auth.scss";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className = "", children }: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${className} ${
        isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isLoggingOut ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Logging out...
        </div>
      ) : (
        children || "Logout"
      )}
    </button>
  );
}
