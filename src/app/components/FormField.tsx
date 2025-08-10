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
        className="block text-body font-medium text-muted mb-3"
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
          } pr-5 py-4 bg-white border-2 border-primary-300 rounded-input focus:border-primary-400 focus:outline-none transition-all duration-200 text-secondary ${className}`}
          placeholder=""
        />
      </div>
      {error && <p className="text-error text-body mt-2">{error}</p>}
    </div>
  )
);

FormField.displayName = "FormField";
