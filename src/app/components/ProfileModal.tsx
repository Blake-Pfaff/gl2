"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FormField } from "./FormField";
import { UserIcon, BriefcaseIcon } from "./Icons";
import Dropdown, { DropdownOption } from "./Dropdown";
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

type ProfileFormData = {
  bio: string;
  jobTitle: string;
  gender: string;
  lookingFor: string;
  locationLabel: string;
};

const GENDER_OPTIONS: DropdownOption[] = [
  { value: "MAN", label: "Man", icon: "👨" },
  { value: "WOMAN", label: "Woman", icon: "👩" },
  { value: "NON_BINARY", label: "Non-binary", icon: "🏳️‍⚧️" },
  { value: "GENDERFLUID", label: "Genderfluid", icon: "🌊" },
  { value: "AGENDER", label: "Agender", icon: "⚪" },
  { value: "TRANSGENDER_WOMAN", label: "Transgender Woman", icon: "🏳️‍⚧️" },
  { value: "TRANSGENDER_MAN", label: "Transgender Man", icon: "🏳️‍⚧️" },
  { value: "QUESTIONING", label: "Questioning", icon: "❓" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say", icon: "🤐" },
  { value: "OTHER", label: "Other", icon: "✨" },
];

const LOOKING_FOR_OPTIONS: DropdownOption[] = [
  { value: "MEN", label: "Men", icon: "👨" },
  { value: "WOMEN", label: "Women", icon: "👩" },
  { value: "NON_BINARY_PEOPLE", label: "Non-binary people", icon: "🏳️‍⚧️" },
  { value: "EVERYONE", label: "Everyone", icon: "🌈" },
];

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
                <div className="space-y-4">
                  <h3 className="text-body font-medium text-primary">
                    Basic Information
                  </h3>

                  <FormField
                    label="Bio"
                    as="textarea"
                    rows={4}
                    maxLength={255}
                    error={errors.bio?.message}
                    {...register("bio", {
                      maxLength: {
                        value: 255,
                        message: "Bio must be 255 characters or less",
                      },
                    })}
                  />

                  <FormField
                    label="Job Title"
                    type="text"
                    icon={<BriefcaseIcon />}
                    error={errors.jobTitle?.message}
                    {...register("jobTitle")}
                  />

                  <FormField
                    label="Location"
                    type="text"
                    error={errors.locationLabel?.message}
                    {...register("locationLabel")}
                  />
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <h3 className="text-body font-medium text-primary">
                    Preferences
                  </h3>

                  <Dropdown
                    label="Gender"
                    value={selectedGender}
                    onChange={(value) => {
                      setSelectedGender(value);
                      checkForChanges();
                    }}
                    options={GENDER_OPTIONS}
                    placeholder="Select your gender"
                    error={errors.gender?.message}
                  />

                  <Dropdown
                    label="Looking For"
                    value={selectedLookingFor}
                    onChange={(value) => {
                      setSelectedLookingFor(value);
                      checkForChanges();
                    }}
                    options={LOOKING_FOR_OPTIONS}
                    placeholder="Select preference"
                    error={errors.lookingFor?.message}
                  />
                </div>

                {/* Photos Section - Placeholder */}
                <div className="space-y-4">
                  <h3 className="text-body font-medium text-primary">Photos</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Existing photos */}
                    {user.photos?.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="aspect-square bg-gray-100 rounded-small border border-gray-200 flex items-center justify-center"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || `Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-small"
                        />
                      </div>
                    ))}

                    {/* Photo upload placeholders */}
                    {Array.from({ length: 6 - (user.photos?.length || 0) }).map(
                      (_, index) => (
                        <div
                          key={`placeholder-${index}`}
                          className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-small flex items-center justify-center text-gray-400"
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">📷</div>
                            <div className="text-caption">Add Photo</div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-caption text-muted">
                    Photo upload functionality coming soon!
                  </p>
                </div>

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
