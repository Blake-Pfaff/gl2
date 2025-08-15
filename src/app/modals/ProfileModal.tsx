"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ProfileBasicInfoSection, {
  ProfileFormData,
} from "@/app/components/ProfileBasicInfoSection";
import ProfilePreferencesSection from "@/app/components/ProfilePreferencesSection";
import ProfilePhotosSection from "@/app/components/ProfilePhotosSection";
import { animations } from "@/lib/animations";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    bio?: string | null;
    jobTitle?: string | null;
    gender?: string | null;
    lookingFor?: string | null;
    locationLabel?: string | null;
    photos?: Array<{
      id: string;
      url: string;
      caption?: string | null;
      order: number;
      isMain: boolean;
    }>;
  };
  onUpdate: (updatedUser: any) => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: ProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGender, setSelectedGender] = useState(user.gender || "");
  const [selectedLookingFor, setSelectedLookingFor] = useState(
    user.lookingFor || ""
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      bio: user.bio || "",
      jobTitle: user.jobTitle || "",
      gender: user.gender || "",
      lookingFor: user.lookingFor || "",
      locationLabel: user.locationLabel || "",
    },
  });

  // Update dropdown states when user data changes
  useEffect(() => {
    setSelectedGender(user.gender || "");
    setSelectedLookingFor(user.lookingFor || "");
    setHasUnsavedChanges(false); // Reset when user data changes
  }, [user.gender, user.lookingFor]);

  // Check for unsaved changes
  const checkForChanges = () => {
    const formData = getValues();
    const hasFormChanges =
      formData.bio !== (user.bio || "") ||
      formData.jobTitle !== (user.jobTitle || "") ||
      formData.locationLabel !== (user.locationLabel || "") ||
      selectedGender !== (user.gender || "") ||
      selectedLookingFor !== (user.lookingFor || "");

    setHasUnsavedChanges(hasFormChanges);
    return hasFormChanges;
  };

  // Watch form changes to update unsaved changes state
  useEffect(() => {
    const subscription = watch(() => {
      checkForChanges();
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedGender, selectedLookingFor, user]);

  // Guarded close function
  const handleGuardedClose = () => {
    if (checkForChanges()) {
      toast.error(
        <div className="flex flex-col gap-2">
          <span className="font-medium">Unsaved Changes</span>
          <span className="text-sm">
            You have unsaved changes. Do you want to discard them?
          </span>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss();
                reset();
                setSelectedGender(user.gender || "");
                setSelectedLookingFor(user.lookingFor || "");
                setHasUnsavedChanges(false);
                onClose();
              }}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              aria-label="Close notification"
            >
              Keep Editing
            </button>
          </div>
        </div>,
        {
          duration: 10000,
          style: {
            background: "#fef2f2",
            border: "1px solid #dc2626",
            color: "#dc2626",
          },
        }
      );
    } else {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Get current scroll position
      const scrollY = window.scrollY;

      // Lock the body scroll and maintain scroll position
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore body scroll
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    console.log("ProfileModal - Form submitted!", data);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          gender: selectedGender,
          lookingFor: selectedLookingFor,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const result = await response.json();
      onUpdate(result.user);

      toast.success("Profile updated successfully! ✨", {
        style: {
          background: "#dcfce7",
          border: "1px solid #16a34a",
          color: "#15803d",
        },
      });

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(); // Reset form to default values
    setSelectedGender(user.gender || "");
    setSelectedLookingFor(user.lookingFor || "");
    setHasUnsavedChanges(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleGuardedClose}
          >
            <motion.div
              data-testid="profile-modal"
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary-200"
              variants={animations.variants.dropdown.menu}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-subheading font-bold text-primary">
                  Edit Profile
                </h2>
                <button
                  type="button"
                  onClick={handleGuardedClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Basic Info */}
                <ProfileBasicInfoSection register={register} errors={errors} />

                {/* Preferences */}
                <ProfilePreferencesSection
                  selectedGender={selectedGender}
                  selectedLookingFor={selectedLookingFor}
                  onGenderChange={(value) => {
                    setSelectedGender(value);
                    checkForChanges();
                  }}
                  onLookingForChange={(value) => {
                    setSelectedLookingFor(value);
                    checkForChanges();
                  }}
                  errors={errors}
                />

                {/* Photos */}
                <ProfilePhotosSection
                  photos={user.photos}
                  onUpdate={() => {
                    // The photo hooks will automatically refetch profile data
                    // which will update the user prop through the parent component
                  }}
                />

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleGuardedClose}
                    className="px-6 py-3 text-body font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary-400 hover:bg-primary-500 text-white font-medium rounded-button transition-colors disabled:opacity-50"
                    {...animations.presets.button}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
