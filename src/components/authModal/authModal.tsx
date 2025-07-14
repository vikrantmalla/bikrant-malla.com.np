"use client";
import { useState } from "react";
import CustomLoginLink from "./CustomLoginLink";
import CustomLogoutButton from "./CustomLogoutButton";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "logout";
}

export default function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {type === "login" ? "Log In" : "Log Out"}
        </h2>
        {type === "login" ? (
          <div className="space-y-4">
            <p>Sign in to access the dashboard.</p>
            <CustomLoginLink className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Sign In with Kinde
            </CustomLoginLink>
            <button onClick={onClose} className="text-gray-500 hover:underline">
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Are you sure you want to log out?</p>
            <CustomLogoutButton className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Log Out
            </CustomLogoutButton>
            <button onClick={onClose} className="text-gray-500 hover:underline">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
