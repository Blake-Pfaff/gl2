"use client";

import { motion } from "framer-motion";
import { animations } from "@/lib/animations";
import OnboardingLayout from "../components/OnboardingLayout";

export default function OnboardingOneClient() {
  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={4}
      nextRoute="/onboarding-two"
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
          We gift Proximity !
        </h1>
        <p className="text-body text-secondary">
          In publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to demonstrate the visual form of a document or a
          typeface without relying on meaningful content.
        </p>
      </motion.div>
    </OnboardingLayout>
  );
}
