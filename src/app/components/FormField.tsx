import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

interface BaseFormFieldProps {
  label: string;
  name: string;
  icon?: React.ReactNode;
  error?: string;
  as?: "input" | "textarea";
  rows?: number; // For textarea
}

type FormFieldProps = BaseFormFieldProps &
  (
    | InputHTMLAttributes<HTMLInputElement>
    | TextareaHTMLAttributes<HTMLTextAreaElement>
  );

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    {
      label,
      name,
      icon,
      error,
      as = "input",
      rows = 4,
      className = "",
      ...rest
    },
    ref
  ) => {
    const baseClasses = `w-full ${
      icon ? "pl-12" : "pl-5"
    } pr-5 py-4 bg-white border-2 border-primary-300 rounded-input focus:border-primary-400 focus:outline-none transition-all duration-200 text-secondary ${className}`;

    return (
      <div>
        <label
          htmlFor={name}
          className="block text-body font-medium text-muted mb-3"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div
              className={`absolute ${
                as === "textarea" ? "top-4" : "inset-y-0"
              } left-0 pl-4 flex ${
                as === "textarea" ? "" : "items-center"
              } pointer-events-none`}
            >
              {icon}
            </div>
          )}
          {as === "textarea" ? (
            <textarea
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
              id={name}
              name={name}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              className={`${baseClasses} resize-none`}
              placeholder=""
            />
          ) : (
            <input
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
              id={name}
              name={name}
              ref={ref as React.Ref<HTMLInputElement>}
              className={baseClasses}
              placeholder=""
            />
          )}
        </div>
        {error && <p className="text-error text-body mt-2">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
