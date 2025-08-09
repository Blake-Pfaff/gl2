"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { ConfirmationModal } from "./ConfirmationModal";

interface LogoutButtonProps {
  variant?: "default" | "header";
  className?: string;
}

export default function LogoutButton({
  variant = "default",
  className = "",
}: LogoutButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowModal(false);
    await signOut({
      callbackUrl: "/login",
    });
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  if (variant === "header") {
    return (
      <>
        <button
          onClick={handleLogoutClick}
          className={` text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded px-2 py-1 ${className}`}
        >
          Sign Out
        </button>
        <ConfirmationModal
          isOpen={showModal}
          onClose={handleCancelLogout}
          onConfirm={handleConfirmLogout}
          title="Sign Out"
          message="Are you sure you want to sign out?"
          confirmText="Sign Out"
          cancelText="Cancel"
          confirmVariant="danger"
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className={`bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className}`}
      >
        Sign Out
      </button>
      <ConfirmationModal
        isOpen={showModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </>
  );
}
