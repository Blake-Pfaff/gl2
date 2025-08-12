"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { animations } from "@/lib/animations";
import OnboardingProgress from "./OnboardingProgress";
import { useRouter } from "next/navigation";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  nextRoute: string;
  nextButtonText?: string;
  onNextClick?: () => void;
  onBackClick?: () => void;
  disableBack?: boolean;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  nextRoute,
  nextButtonText = "Next",
  onNextClick,
  onBackClick,
  disableBack = false,
}: OnboardingLayoutProps) {
  const router = useRouter();

  const handleNext = () => {
    if (onNextClick) {
      onNextClick();
    } else {
      router.push(nextRoute);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-page-x py-page-y max-w-3xl mx-auto w-full flex-1">
        {/* Header row with back and next */}
        <div className="flex items-center justify-between mb-section">
          <motion.button
            className={`w-12 h-12 ${
              disableBack ? "bg-gray-300 cursor-not-allowed" : "bg-primary-400"
            } text-white rounded-button flex items-center justify-center`}
            {...(disableBack ? {} : animations.presets.button)}
            disabled={disableBack}
            onClick={() => {
              if (disableBack) return;
              if (onBackClick) {
                onBackClick();
              } else {
                router.back();
              }
            }}
          >
            ←
          </motion.button>
          <button
            className="text-body text-link font-medium"
            onClick={handleNext}
          >
            {nextButtonText}
          </button>
        </div>

        {/* Main content */}
        <motion.div {...animations.utils.createEntrance(0.1)}>
          {children}
        </motion.div>

        {/* Progress */}
        <div className="mt-section">
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>
      </div>
    </div>
  );
}
