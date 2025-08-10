"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUsers, type User, type PaginationInfo } from "@/hooks/useUsers";
import LoadingSpinner from "./LoadingSpinner";

export default function UsersGrid() {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  // Use React Query to fetch users
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useUsers(currentPage, limit, !!session);

  const users = usersResponse?.users || [];
  const pagination = usersResponse?.pagination || null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load users. Please try again.</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No users found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            {/* Profile Photo */}
            <div className="h-48 bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
              {user.photos.length > 0 ? (
                <img
                  src={user.photos[0].url}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase() ||
                      user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {user.name || "Unknown"}
              </h3>

              {user.jobTitle && (
                <p className="text-sm text-gray-600 mb-2">{user.jobTitle}</p>
              )}

              {user.locationLabel && (
                <p className="text-xs text-gray-500 mb-3">
                  📍 {user.locationLabel}
                </p>
              )}

              {user.bio && (
                <p className="text-sm text-gray-700 line-clamp-2">{user.bio}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4 flex space-x-2">
              <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200">
                💕 Like
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg transition-colors duration-200">
                💬 Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {users.length} of {pagination.totalCount} users
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pagination.hasPrevPage
                  ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                const isActive = pageNum === currentPage;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-primary-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pagination.hasNextPage
                  ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
