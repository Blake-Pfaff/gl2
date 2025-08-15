"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { animations } from "@/lib/animations";
import { usePhotoUpdate, usePhotoDelete } from "@/hooks/usePhotos";
import { ConfirmationModal } from "@/app/modals/ConfirmationModal";

interface Photo {
  id: string;
  url: string;
  caption?: string | null;
  order: number;
  isMain: boolean;
}

interface PhotoCardProps {
  photo: Photo;
  onUpdate?: () => void;
}

export default function PhotoCard({ photo, onUpdate }: PhotoCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updatePhotoMutation = usePhotoUpdate();
  const deletePhotoMutation = usePhotoDelete();

  const handleSetAsMain = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PhotoCard - Set as main clicked for photo:", photo.id);
    try {
      console.log("PhotoCard - Calling updatePhotoMutation");
      await updatePhotoMutation.mutateAsync({
        photoId: photo.id,
        isMain: true,
      });
      console.log("PhotoCard - Set as main successful");
      toast.success("Main photo updated! ✨", {
        style: {
          background: "#dcfce7",
          border: "1px solid #16a34a",
          color: "#15803d",
        },
      });
      // Don't call onUpdate - React Query mutation already invalidates the profile data
    } catch (error: any) {
      console.error("PhotoCard - Set as main failed:", error);
      toast.error(error.message || "Failed to update main photo");
    }
  };

  const handleDelete = async () => {
    console.log("PhotoCard - Delete clicked for photo:", photo.id);
    try {
      console.log("PhotoCard - Calling deletePhotoMutation");
      await deletePhotoMutation.mutateAsync(photo.id);
      console.log("PhotoCard - Delete successful");
      toast.success("Photo deleted successfully! ✨", {
        style: {
          background: "#dcfce7",
          border: "1px solid #16a34a",
          color: "#15803d",
        },
      });
      // Don't call onUpdate - React Query mutation already invalidates the profile data
    } catch (error: any) {
      console.error("PhotoCard - Delete failed:", error);
      toast.error(error.message || "Failed to delete photo");
    }
  };

  const isLoading =
    updatePhotoMutation.isPending || deletePhotoMutation.isPending;

  return (
    <>
      <motion.div
        className="relative group"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        layout
      >
        {/* Photo Container */}
        <div className="relative aspect-square rounded-small overflow-hidden border border-gray-200">
          <img
            src={photo.url}
            alt={photo.caption || "User photo"}
            className="w-full h-full object-cover"
          />

          {/* Main Photo Badge */}
          {photo.isMain && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-small">
                Main
              </span>
            </div>
          )}

          {/* Actions Overlay */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex space-x-2">
                  {!photo.isMain && (
                    <motion.button
                      type="button"
                      onClick={handleSetAsMain}
                      disabled={isLoading}
                      className="px-3 py-1 bg-white text-primary-600 text-xs font-medium rounded-small hover:bg-gray-100 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Set as Main
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    disabled={isLoading}
                    className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-small hover:bg-red-600 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>

        {/* Caption */}
        {photo.caption && (
          <p className="mt-2 text-caption text-secondary line-clamp-2">
            {photo.caption}
          </p>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Photo"
        message="Are you sure you want to delete this photo? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}
