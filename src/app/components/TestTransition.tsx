"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TestTransitionProps {
  children: ReactNode;
}

export default function TestTransition({ children }: TestTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
