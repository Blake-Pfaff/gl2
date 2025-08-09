import React, { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, name, ...rest }, ref) => (
    <div className="flex flex-col mb-4">
      <label htmlFor={name} className="mb-1 font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        ref={ref}
        {...rest}
        className="border rounded px-3 py-2"
      />
    </div>
  )
);
FormInput.displayName = "FormInput";
