"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormField } from "./FormField";
import { BriefcaseIcon } from "./Icons";

export type ProfileFormData = {
  bio: string;
  jobTitle: string;
  gender: string;
  lookingFor: string;
  locationLabel: string;
};

interface ProfileBasicInfoSectionProps {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

export default function ProfileBasicInfoSection({
  register,
  errors,
}: ProfileBasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-body font-medium text-primary">Basic Information</h3>

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
  );
}
