"use client";

import { User } from "next-auth";
import LogoutButton from "./LogoutButton";

interface AuthenticatedHeaderProps {
  user:
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    | undefined;
}

export default function AuthenticatedHeader({
  user,
}: AuthenticatedHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/App Name */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">💕 Dating App</h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Avatar/Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <LogoutButton variant="header" />
          </div>
        </div>
      </div>
    </header>
  );
}
