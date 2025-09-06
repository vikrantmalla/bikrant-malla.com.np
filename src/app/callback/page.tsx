'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CallbackPage() {
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const handleAuth = async () => {
      try {
        if (isAuthenticated && user) {
          // Redirect to dashboard after successful authentication
          router.push('/dashboard');
        } else {
          // If authentication failed, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };

    handleAuth();
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
