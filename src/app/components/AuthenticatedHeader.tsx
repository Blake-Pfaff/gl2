"use client";

import { useState } from "react";
import LogoutButton from "./LogoutButton";
import ProfileModal from "@/app/modals/ProfileModal";
import { useProfile } from "@/hooks/useProfile";
import Image from "next/image";

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
    data: profileData,
    isLoading: profileLoading,
    refetch,
  } = useProfile();

  const handleProfileUpdate = (updatedUser: any) => {
    // Refetch profile data to update the UI
    refetch();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/App Name */}
            <div className="flex items-center mt-3">
              <Image
                src={"/glMobileLogo.png"}
                alt={"Goldy Locks Logo"}
                width={130}
                height={130}
                priority
                className="object-contain"
              />
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              {/* User Avatar/Info - Clickable */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none rounded-lg p-1"
                aria-label="Open profile"
              >
                {/* Profile Photo or Fallback */}
                {profileData?.user?.photos?.find((p) => p.isMain)?.url ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-200">
                    <img
                      src={profileData.user.photos.find((p) => p.isMain)?.url}
                      alt={`${user?.name || "User"}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-body font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-body font-medium text-primary">
                    {user?.name || "User"}
                  </p>
                  <p className="text-caption text-muted">{user?.email}</p>
                </div>
              </button>

              {/* Logout Button */}
              <LogoutButton variant="header" />
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {profileData?.user && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={profileData.user}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}
