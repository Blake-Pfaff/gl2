"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import AuthenticatedHeader from "./AuthenticatedHeader";
import BottomNavigation from "./BottomNavigation";
import LoadingSpinner from "./LoadingSpinner";
import PageTransition from "./PageTransition";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession();

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner color="blue" text="Loading..." />
      </div>
    );
  }

  // If not authenticated, this should be handled by page-level redirects
  // This is now just a safety fallback
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary">Authentication required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - remains stable */}
      <AuthenticatedHeader user={session.user} />

      {/* Main content area with transitions */}
      <main className="flex-1 pb-16">
        {/* pb-16 to account for bottom nav height */}
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Bottom Navigation - remains stable */}
      <BottomNavigation />
    </div>
  );
}
