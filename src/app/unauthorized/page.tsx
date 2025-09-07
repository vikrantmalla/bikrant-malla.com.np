"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import CustomLoginLink from "@/components/authModal/CustomLoginLink";

export default function UnauthorizedPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            You don&apos;t have permission to access this page. Please contact the portfolio owner for access.
          </p>
          
          <div className="space-y-4">
            {!isAuthenticated ? (
              <CustomLoginLink className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Sign In
              </CustomLoginLink>
            ) : (
              <Link 
                href="/"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors inline-block text-center"
              >
                Go to Portfolio
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 