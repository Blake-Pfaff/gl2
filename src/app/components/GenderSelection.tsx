import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface GenderSelectionProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

const genderOptions = [
  { value: "male", label: "Male", emoji: "😊" },
  { value: "female", label: "Female", emoji: "👩" },
  { value: "none", label: "None", emoji: "😊" },
];

export function GenderSelection({ register, error }: GenderSelectionProps) {
  return (
    <div>
      <label className="block text-body font-medium text-muted mb-3">
        Gender
      </label>
      <div className="bg-white border-2 border-primary-300 rounded-input p-component space-y-3">
        {genderOptions.map(({ value, label, emoji }) => (
          <div key={value} className="flex items-center">
            <input
              id={value}
              type="radio"
              value={value}
              {...register("gender", {
                required: "Please select a gender",
              })}
              className="h-4 w-4 text-primary-400 border-primary-300 focus:ring-primary-400"
            />
            <label
              htmlFor={value}
              className="ml-3 text-body text-secondary flex items-center"
            >
              {label} <span className="ml-2">{emoji}</span>
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-error text-body mt-2">{error.message}</p>}
    </div>
  );
}
