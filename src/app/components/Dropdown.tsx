"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animations } from "@/lib/animations";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export default function Dropdown({
  value,
  onChange,
  options,
  label,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  error,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    const option = options.find((opt) => opt.value === optionValue);
    if (option && !option.disabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-body font-medium text-muted mb-3">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Dropdown Button */}
        <motion.button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`w-full px-4 py-4 bg-white border-2 rounded-small focus:outline-none focus:ring-0 transition-all duration-200 text-secondary font-medium shadow-sm text-left flex items-center justify-between ${
            error
              ? "border-red-300 focus:border-red-400"
              : "border-primary-300 focus:border-primary-400"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-primary-400"
          }`}
          variants={animations.variants.dropdown.button}
          initial="rest"
          whileHover={disabled ? "rest" : "hover"}
          whileTap={disabled ? "rest" : "tap"}
          transition={animations.transitions.fast}
        >
          <span className="flex items-center gap-2">
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className="flex-shrink-0">
                    {typeof selectedOption.icon === "string" ? (
                      <span className="text-lg">{selectedOption.icon}</span>
                    ) : (
                      selectedOption.icon
                    )}
                  </span>
                )}
                <span>{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-muted">{placeholder}</span>
            )}
          </span>

          <motion.svg
            className={`w-4 h-4 flex-shrink-0 ${
              error ? "text-red-400" : "text-muted"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            variants={animations.variants.dropdown.arrow}
            animate={isOpen ? "open" : "closed"}
            transition={animations.transitions.fast}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.button>

        {/* Error Message */}
        {error && <p className="text-error text-body mt-2 pl-1">{error}</p>}

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              variants={animations.variants.dropdown.menu}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={animations.transitions.smooth}
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary-200 rounded-small shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                  className={`w-full px-4 py-3 text-left transition-all duration-150 flex items-center gap-2 text-secondary font-medium first:rounded-t-small last:rounded-b-small ${
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-50 focus:bg-primary-50 focus:outline-none cursor-pointer"
                  } ${
                    option.value === value
                      ? "bg-primary-50 text-primary-600"
                      : ""
                  }`}
                  variants={animations.variants.dropdown.item}
                  initial="initial"
                  animate="animate"
                  transition={{
                    delay: index * animations.stagger.fast,
                    ...animations.transitions.fast,
                  }}
                  whileHover={option.disabled ? "initial" : "hover"}
                  whileTap={option.disabled ? "initial" : "tap"}
                >
                  {option.icon && (
                    <span className="flex-shrink-0">
                      {typeof option.icon === "string" ? (
                        <span className="text-lg">{option.icon}</span>
                      ) : (
                        option.icon
                      )}
                    </span>
                  )}
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <motion.svg
                      className="w-4 h-4 text-primary-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={animations.transitions.fast}
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </motion.svg>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              variants={animations.variants.dropdown.backdrop}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
