"use client";

import { motion } from "framer-motion";
import { animations } from "@/lib/animations";
import Image from "next/image";
import OnboardingLayout from "../components/OnboardingLayout";

export default function OnboardingOnePage() {
  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={4}
      nextRoute="/onboarding-two"
    >
      {/* Hero area */}
      <motion.div
        className=" flex items-center justify-center mb-section min-h-[220px]"
        {...animations.utils.createEntrance(0.1)}
      >
        <Image
          src="/goldyIntroM.png"
          alt={"Introduction to Goldy Locks"}
          width={200}
          height={200}
          priority
          className="object-contain"
        />
      </motion.div>

      {/* Title and description */}
      <motion.div {...animations.utils.createEntrance(0.2)}>
        <h1 className="text-hero font-bold text-primary mb-2">
          Welcome to Goldy Locks !
        </h1>
        <p className="text-body text-secondary">
          Goldy Locks is the dating app that makes sure things aren’t too hot or
          too cold, thanks to our advanced user ranking system. Im Goldy your
          personal AI assistant, I’ll help you find your perfect match.
        </p>
      </motion.div>
    </OnboardingLayout>
  );
}
