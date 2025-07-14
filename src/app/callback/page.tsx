"use client";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeRedirectUrl } from "@/lib/kinde-config";

export default function CallbackPage() {
  const { isAuthenticated, user } = useKindeBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          setError("Authentication timeout. Please try again.");
          setIsProcessing(false);
        }, 10000); // 10 second timeout

        // Wait a bit for authentication to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isAuthenticated && user) {
          clearTimeout(timeout);
          // Get the redirect URL from query params or default to dashboard
          const redirectTo = sanitizeRedirectUrl(searchParams.get("redirect") || "/dashboard");
          
          // Redirect to the intended page
          router.push(redirectTo);
        } else {
          clearTimeout(timeout);
          // If authentication failed, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Callback error:", error);
        setError("Authentication failed. Please try again.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [isAuthenticated, user, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isProcessing ? "Processing authentication..." : "Redirecting..."}
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your sign-in.
            </p>
          </>
        )}
      </div>
    </div>
  );
} 