"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  hoverable?: boolean;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  hover: {
    y: -4,
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
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
