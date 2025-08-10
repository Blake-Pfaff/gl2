"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const buttonVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

export default function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseClasses =
    "font-semibold rounded-button transition-all duration-200 flex items-center justify-center gap-3";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg disabled:opacity-50",
    secondary:
      "bg-white border-2 border-gray-300 hover:border-gray-400 text-secondary shadow-sm",
    outline: "border-2 border-primary-400 text-primary-400 hover:bg-primary-50",
  };

  const sizeClasses = {
    sm: "py-2 px-4 text-body",
    md: "py-component px-6 text-body",
    lg: "py-4 px-8 text-subheading",
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      variants={buttonVariants}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      whileTap={disabled ? "rest" : "tap"}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
