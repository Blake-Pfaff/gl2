import React, { InputHTMLAttributes, forwardRef } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: React.ReactNode;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, name, icon, error, className = "", ...rest }, ref) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-600 mb-3"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...rest}
          id={name}
          name={name}
          ref={ref}
          className={`w-full ${
            icon ? "pl-12" : "pl-5"
          } pr-5 py-4 bg-white border-2 border-primary-300 rounded-2xl focus:border-primary-400 focus:outline-none transition-all duration-200 text-gray-700 ${className}`}
          placeholder=""
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
);

FormField.displayName = "FormField";
