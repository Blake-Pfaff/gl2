"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  variant?: "default" | "header";
  className?: string;
}

export default function LogoutButton({
  variant = "default",
  className = "",
}: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login", // Redirect to login page after logout
    });
  };

  if (variant === "header") {
    return (
      <button
        onClick={handleLogout}
        className={` text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded px-2 py-1 ${className}`}
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className}`}
    >
      Sign Out
    </button>
  );
}
