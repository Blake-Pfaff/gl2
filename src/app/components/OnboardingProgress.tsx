"use client";

import { motion } from "framer-motion";
import { animations } from "@/lib/animations";

interface OnboardingProgressProps {
  currentStep: number; // 1-indexed
  totalSteps: number;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  // Animation variants for progress dots - using design tokens
  const dotVariants = {
    inactive: {
      scale: 1,
      transition: animations.transitions.smooth,
    },
    completed: {
      scale: 1,
      transition: animations.transitions.smooth,
    },
    current: {
      scale: 1.1,
      transition: animations.transitions.smooth,
    },
  };

  // Animation variants for progress lines
  const lineVariants = {
    incomplete: {
      scaleX: 0,
      originX: 0,
      transition: animations.transitions.smooth,
    },
    complete: {
      scaleX: 1,
      originX: 0,
      transition: {
        ...animations.transitions.smooth,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="w-full flex items-center justify-center"
      {...animations.utils.createEntrance(0.1)}
    >
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        const isLast = index === steps.length - 1;

        // Determine dot state
        const dotState = isCurrent
          ? "current"
          : isCompleted
          ? "completed"
          : "inactive";

        return (
          <div key={step} className="flex items-center">
            {/* Animated Progress Dot */}
            <motion.div
              data-testid={`progress-step-${step}`}
              className={`w-5 h-5 rounded-full ${
                isCurrent
                  ? "bg-primary-600 shadow-md" // Current: darker primary with shadow
                  : isCompleted
                  ? "bg-primary-400" // Completed: gold/primary color
                  : "bg-gray-200" // Inactive: gray
              }`}
              variants={dotVariants}
              animate={dotState}
              initial="inactive"
            />

            {/* Animated Progress Line */}
            {!isLast && (
              <div className="w-16 h-1 bg-gray-200 relative overflow-hidden rounded-full">
                <motion.div
                  className={`absolute inset-0 rounded-full ${
                    isCompleted ? "bg-primary-400" : "bg-gray-200"
                  }`}
                  variants={lineVariants}
                  animate={isCompleted ? "complete" : "incomplete"}
                />
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
