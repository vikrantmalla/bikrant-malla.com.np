'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useState, useEffect } from 'react';

export default function KindeDebugPage() {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    getToken,
    getPermissions,
    getOrganization,
    getFlag
  } = useKindeBrowserClient();

  const [debugInfo, setDebugInfo] = useState<any>({});
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<any>(null);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        const tokenData = await getToken();
        const permissionsData = await getPermissions();
        
        setToken(tokenData);
        setPermissions(permissionsData);
        
        setDebugInfo({
          isAuthenticated,
          user,
          isLoading,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          urls: {
            current: window.location.href,
            origin: window.location.origin,
            hostname: window.location.hostname,
          }
        });
      } catch (error) {
        console.error('Debug fetch error:', error);
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    };

    if (!isLoading) {
      fetchDebugInfo();
    }
  }, [isAuthenticated, user, isLoading, getToken, getPermissions]);

  // Security: Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Debug page is only available in development mode.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Kinde debug info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kinde Debug Dashboard</h1>
        
        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <LoginLink
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </LoginLink>
            <LogoutLink
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </LogoutLink>
            <RegisterLink
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Register
            </RegisterLink>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Authenticated:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Loading:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isLoading ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* User Information */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <div><span className="font-medium">ID:</span> {user.id}</div>
              <div><span className="font-medium">Email:</span> {user.email}</div>
              <div><span className="font-medium">Name:</span> {user.given_name} {user.family_name}</div>
              <div><span className="font-medium">Picture:</span> {user.picture ? '✅' : '❌'}</div>
            </div>
          </div>
        )}

        {/* Token Information */}
        {token && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Token Information</h2>
            <div className="bg-gray-100 p-4 rounded">
              <code className="text-sm break-all">{token}</code>
            </div>
          </div>
        )}

        {/* Permissions */}
        {permissions && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Permissions</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(permissions, null, 2)}
            </pre>
          </div>
        )}

        {/* Debug Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
