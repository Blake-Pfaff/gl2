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

  return (
    <motion.div
      className="w-full flex items-center justify-center"
      {...animations.utils.createEntrance(0.1)}
    >
      {steps.map((step, index) => {
        const isActive = step <= currentStep;
        const isLast = index === steps.length - 1;
        return (
          <div key={step} className="flex items-center">
            <div
              data-testid={`progress-step-${step}`}
              className={
                step === currentStep
                  ? "w-5 h-5 rounded-full bg-primary-600 shadow-sm"
                  : step < currentStep
                  ? "w-5 h-5 rounded-full bg-primary-400"
                  : "w-5 h-5 rounded-full bg-gray-200"
              }
            />
            {!isLast && (
              <div
                className={
                  step < currentStep
                    ? "w-16 h-1 bg-primary-400"
                    : "w-16 h-1 bg-gray-200"
                }
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
