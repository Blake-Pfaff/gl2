"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { animations } from "@/lib/animations";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function AnimatedCard({
  children,
  className = "",
  delay = 0,
  onClick,
  hoverable = true,
}: AnimatedCardProps) {
  const baseClasses = "bg-white rounded-card shadow-sm";
  const interactiveClasses = onClick ? "cursor-pointer" : "";

  return (
    <motion.div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      {...animations.presets.card}
      whileHover={hoverable ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      transition={{
        ...animations.transitions.smooth,
        delay,
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
