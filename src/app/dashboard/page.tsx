"use client";
import { useState, useEffect } from "react";
import AuthModal from "@/components/authModal/authModal";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, isAuthenticated, userRole, isCheckingRole, checkUserRole } = useAuth();
  const [inviteData, setInviteData] = useState({ email: "", role: "editor" });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check user role on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated) {
        await checkUserRole();
      }
      setLoading(false);
    };

    initializeAuth();
  }, [isAuthenticated, checkUserRole]);

  const inviteUser = async () => {
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteData.email,
          role: inviteData.role,
        }),
      });
      const result = await response.json();
      alert(response.ok ? result.message : `Error: ${result.error}`);
    } catch (error) {
      console.error("Invite error:", error);
      alert("Failed to send invitation");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has proper permissions
  if (isAuthenticated && userRole && !userRole.hasEditorRole && !userRole.isOwner) {
    // Redirect to unauthorized page - this will be handled by the middleware
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {!isAuthenticated ? (
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Log In
        </button>
      ) : (
        <div>
          <p className="mt-4">Welcome, {user?.given_name || user?.email}</p>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Log Out
          </button>
          <h2 className="text-2xl mt-6">Invite Collaborator</h2>
          <input
            type="email"
            value={inviteData.email}
            onChange={(e) =>
              setInviteData({ ...inviteData, email: e.target.value })
            }
            placeholder="Collaborator Email"
            className="border p-2 rounded w-full mt-2"
          />
          <select
            value={inviteData.role}
            onChange={(e) =>
              setInviteData({ ...inviteData, role: e.target.value })
            }
            className="border p-2 rounded w-full mt-2"
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            onClick={inviteUser}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Send Invitation
          </button>
        </div>
      )}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        type="login"
      />
      <AuthModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        type="logout"
      />
    </div>
  );
}
