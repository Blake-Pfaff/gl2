"use client";

import { motion } from "framer-motion";
import { animations } from "@/lib/animations";
import OnboardingLayout from "../components/OnboardingLayout";

export default function OnboardingThreePage() {
  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      nextRoute="/onboarding-four"
    >
      {/* Hero area */}
      <motion.div
        className="bg-white rounded-card shadow-sm p-component flex items-center justify-center mb-section min-h-[220px]"
        {...animations.utils.createEntrance(0.1)}
      >
        <div className="text-body text-secondary">hero image</div>
      </motion.div>

      {/* Title and description */}
      <motion.div {...animations.utils.createEntrance(0.2)}>
        <h1 className="text-hero font-bold text-primary mb-2">
          Share Your Journey!
        </h1>
        <p className="text-body text-secondary">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </motion.div>
    </OnboardingLayout>
  );
}
