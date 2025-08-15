"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { animations } from "@/lib/animations";

interface ImageUploadProps {
  onUpload: (file: File, caption?: string) => void;
  isUploading?: boolean;
  className?: string;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  compact?: boolean;
}

const DEFAULT_ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const DEFAULT_MAX_SIZE_MB = 5;

export default function ImageUpload({
  onUpload,
  isUploading = false,
  className = "",
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  compact = false,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Please select a valid image file (${acceptedFormats
        .map((format) => format.split("/")[1].toUpperCase())
        .join(", ")})`;
    }

    // Check file size
    const maxSizeBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = () => {
    console.log("ImageUpload - handleUpload called");
    if (!fileInputRef.current?.files?.[0]) {
      console.log("ImageUpload - No file selected");
      toast.error("Please select a file first");
      return;
    }

    const file = fileInputRef.current.files[0];
    console.log(
      "ImageUpload - Calling onUpload with file:",
      file.name,
      file.size
    );
    onUpload(file, caption.trim() || undefined);

    // Reset form
    setPreview(null);
    setCaption("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setCaption("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (compact) {
    return (
      <div className={`h-full ${className}`}>
        {!preview ? (
          // Compact file selection area
          <motion.div
            className={`
              h-full w-full border-2 border-dashed rounded-small flex flex-col items-center justify-center cursor-pointer
              transition-colors duration-200 p-4
              ${
                isDragOver
                  ? "border-primary-400 bg-primary-50"
                  : "border-primary-300 hover:border-primary-400 hover:bg-primary-50"
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(",")}
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-caption font-medium text-primary mb-1">
                Click or Drop
              </p>
              <p className="text-xs text-muted">{maxSizeInMB}MB max</p>
            </div>
          </motion.div>
        ) : (
          // Compact preview and upload area
          <motion.div
            className="h-full flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={animations.transitions.smooth}
          >
            {/* Image Preview */}
            <div className="flex-1 relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-small"
              />
              {/* Loading overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-small">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            {!isUploading && (
              <div className="absolute bottom-2 left-2 right-2 flex space-x-2">
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleUpload}
                  className="flex-1 px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upload
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {!preview ? (
        // File selection area
        <motion.div
          className={`
            relative border-2 border-dashed rounded-small p-6 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragOver
                ? "border-primary-400 bg-primary-50"
                : "border-gray-300 hover:border-primary-300 hover:bg-gray-50"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="space-y-2">
            <div className="text-4xl">📷</div>
            <div>
              <p className="text-body font-medium text-primary">
                Click to upload or drag and drop
              </p>
              <p className="text-caption text-muted mt-1">
                {acceptedFormats
                  .map((format) => format.split("/")[1].toUpperCase())
                  .join(", ")}{" "}
                up to {maxSizeInMB}MB
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        // Preview and upload area
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animations.transitions.smooth}
        >
          {/* Image Preview */}
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full aspect-square object-cover rounded-small border border-gray-200"
            />
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-caption font-medium text-primary mb-2">
              Caption (optional)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption for your photo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-small focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
              rows={2}
              maxLength={100}
              disabled={isUploading}
            />
            <p className="text-xs text-muted mt-1">
              {caption.length}/100 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              type="button"
              onClick={handleCancel}
              disabled={isUploading}
              className="flex-1 px-4 py-2 text-body font-medium text-gray-600 border border-gray-300 rounded-button hover:bg-gray-50 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-button transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
