"use client";

import { motion } from "framer-motion";
import { animations } from "@/lib/animations";
import OnboardingLayout from "../components/OnboardingLayout";
import Image from "next/image";

export default function OnboardingTwoPage() {
  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={4}
      nextRoute="/onboarding-three"
    >
      {/* Hero area */}
      <motion.div
        className="p-component flex items-center justify-center mb-section min-h-[220px]"
        {...animations.utils.createEntrance(0.1)}
      >
        <Image
          src="/glv2nervous.png"
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
          Connecting can be awkward!
        </h1>
        <p className="text-body text-secondary">
          You have your first match, but now… what do you say? You don’t want to
          mess up the opportunity of meeting someone great just because you
          can’t put your feelings into words.
        </p>
      </motion.div>
    </OnboardingLayout>
  );
}
