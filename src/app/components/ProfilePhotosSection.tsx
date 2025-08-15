"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import PhotoCard from "./PhotoCard";
import { usePhotoUpload } from "@/hooks/usePhotos";

interface Photo {
  id: string;
  url: string;
  caption?: string | null;
  order: number;
  isMain: boolean;
}

interface ProfilePhotosSectionProps {
  photos?: Photo[];
  onUpdate?: () => void;
}

export default function ProfilePhotosSection({
  photos = [],
  onUpdate,
}: ProfilePhotosSectionProps) {
  const [showUpload, setShowUpload] = useState(false);
  const photoUploadMutation = usePhotoUpload();

  const handlePhotoUpload = async (file: File, caption?: string) => {
    try {
      await photoUploadMutation.mutateAsync({
        photo: file,
        caption,
        isMain: photos.length === 0, // First photo is automatically main
      });

      toast.success("Photo uploaded successfully! ✨", {
        style: {
          background: "#dcfce7",
          border: "1px solid #16a34a",
          color: "#15803d",
        },
      });

      setShowUpload(false);
      // Don't call onUpdate - React Query mutation already invalidates the profile data
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-body font-medium text-primary">Photos</h3>
        {photos.length < 6 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowUpload(!showUpload);
            }}
            className="px-3 py-1 text-caption font-medium text-primary-600 border border-primary-300 rounded-small hover:bg-primary-50 transition-colors"
          >
            {showUpload ? "Cancel" : "Add Photo"}
          </button>
        )}
      </div>

      {/* Photos Grid - Always visible */}
      <div className="grid grid-cols-3 gap-4">
        {/* Existing photos */}
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onUpdate={onUpdate} />
        ))}

        {/* Upload area - shows inline in grid */}
        {showUpload && photos.length < 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="aspect-square border-2 border-dashed border-primary-300 rounded-small flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-primary-50 transition-colors"
            onClick={() =>
              document.getElementById("photo-upload-input")?.click()
            }
          >
            <input
              id="photo-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handlePhotoUpload(file);
                  e.target.value = ""; // Reset input
                }
              }}
            />
            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-caption font-medium text-primary">
                Click to Upload Photo
              </p>
              <p className="text-xs text-muted mt-1">JPEG, PNG up to 5MB</p>
              {photoUploadMutation.isPending && (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="text-xs text-primary mt-1">Uploading...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Photo upload placeholders - only show when not uploading */}
        {!showUpload &&
          Array.from({
            length: Math.max(0, 6 - photos.length),
          }).map((_, index) => (
            <motion.div
              key={`placeholder-${index}`}
              className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-small flex items-center justify-center text-gray-400 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
              onClick={() => setShowUpload(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📷</div>
                <div className="text-caption">Add Photo</div>
              </div>
            </motion.div>
          ))}
      </div>

      {photos.length > 0 && (
        <p className="text-caption text-muted">
          {photos.find((p) => p.isMain) ? "✨ " : ""}
          You have {photos.length} of 6 photos.
          {photos.find((p) => p.isMain)
            ? " Your main photo is highlighted."
            : " Set a main photo to be featured on your profile."}
        </p>
      )}
    </div>
  );
}
