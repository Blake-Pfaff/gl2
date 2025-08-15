"use client";

import { FieldErrors } from "react-hook-form";
import Dropdown, { DropdownOption } from "./Dropdown";
import { ProfileFormData } from "./ProfileBasicInfoSection";

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

interface ProfilePreferencesSectionProps {
  selectedGender: string;
  selectedLookingFor: string;
  onGenderChange: (value: string) => void;
  onLookingForChange: (value: string) => void;
  errors: FieldErrors<ProfileFormData>;
}

export default function ProfilePreferencesSection({
  selectedGender,
  selectedLookingFor,
  onGenderChange,
  onLookingForChange,
  errors,
}: ProfilePreferencesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-body font-medium text-primary">Preferences</h3>

      <Dropdown
        label="Gender"
        value={selectedGender}
        onChange={onGenderChange}
        options={GENDER_OPTIONS}
        placeholder="Select your gender"
        error={errors.gender?.message}
      />

      <Dropdown
        label="Looking For"
        value={selectedLookingFor}
        onChange={onLookingForChange}
        options={LOOKING_FOR_OPTIONS}
        placeholder="Select preference"
        error={errors.lookingFor?.message}
      />
    </div>
  );
}
