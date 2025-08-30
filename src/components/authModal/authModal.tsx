"use client";
import { useState } from "react";
import CustomLoginLink from "./CustomLoginLink";
import CustomLogoutButton from "./CustomLogoutButton";
import "./authModal.scss";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "logout";
}

export default function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <div className="modal-content">
        <h2 className="modal-title">
          {type === "login" ? "Log In" : "Log Out"}
        </h2>
        {type === "login" ? (
          <div className="modal-body">
            <p className="description">Sign in to access the dashboard.</p>
            <div className="button-group">
              <CustomLoginLink className="primary-button login">
                Sign In with Kinde
              </CustomLoginLink>
              <button onClick={onClose} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <p className="description">Are you sure you want to log out?</p>
            <div className="button-group">
              <CustomLogoutButton className="primary-button logout">
                Log Out
              </CustomLogoutButton>
              <button onClick={onClose} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
