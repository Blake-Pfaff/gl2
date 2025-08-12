"use client";

import { motion } from "framer-motion";
import { animations } from "@/lib/animations";
import OnboardingLayout from "../components/OnboardingLayout";
import Image from "next/image";

export default function OnboardingThreePage() {
  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      nextRoute="/onboarding-four"
    >
      {/* Hero area */}
      <motion.div
        className=" p-component flex items-center justify-center mb-section min-h-[220px]"
        {...animations.utils.createEntrance(0.1)}
      >
        <Image
          src="/gLIdea.png"
          alt={"Goldy looking nervous"}
          width={200}
          height={200}
          priority
          className="object-contain"
        />
      </motion.div>

      {/* Title and description */}
      <motion.div {...animations.utils.createEntrance(0.2)}>
        <h1 className="text-hero font-bold text-primary mb-2">
          Don’t worry, Goldy—your personal AI assistant—is here to help!!
        </h1>
        <p className="text-body text-secondary">
          Let Goldy scan the match’s profile and yours to string together your
          feelings in a way you may struggle to. Tell Goldy if you want to be
          flirty, friendly, or just inquisitive, and let it find your words.
        </p>
      </motion.div>
    </OnboardingLayout>
  );
}
