"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { animations } from "@/lib/animations";
import OnboardingLayout from "../components/OnboardingLayout";
import {
  useOnboardingSteps,
  useCompleteOnboarding,
} from "@/hooks/useOnboarding";
import LoadingSpinner from "../components/LoadingSpinner";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { data: steps, isLoading, error } = useOnboardingSteps();
  const completeOnboarding = useCompleteOnboarding();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner color="blue" text="Loading onboarding..." />
      </div>
    );
  }

  if (error || !steps || steps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-error">
            Failed to load onboarding content
          </p>
          <button
            onClick={() => router.push("/users")}
            className="mt-4 px-6 py-2 bg-primary-400 text-white rounded-button"
          >
            Skip to App
          </button>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;
  const currentStepNumber = currentStepIndex + 1;

  const handleNext = async () => {
    if (isLastStep) {
      // Complete onboarding
      try {
        await completeOnboarding.mutateAsync({});
        await update(); // Refresh session
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Error completing onboarding:", error);
        router.push("/users"); // Fallback navigation
      }
    } else {
      // Move to next step
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
    // If we're on the first step, do nothing - keep user in onboarding
  };

  return (
    <OnboardingLayout
      currentStep={currentStepNumber}
      totalSteps={steps.length}
      nextRoute={isLastStep ? "/users" : ""}
      nextButtonText={
        completeOnboarding.isPending
          ? "Completing..."
          : isLastStep
          ? "Get Started"
          : "Next"
      }
      onNextClick={handleNext}
      onBackClick={handleBack}
      disableBack={isFirstStep}
    >
      {/* Hero area */}
      <motion.div
        key={currentStep.id} // Re-animate when step changes
        className="flex items-center justify-center mb-section min-h-[220px]"
        {...animations.utils.createEntrance(0.1)}
      >
        <Image
          src={currentStep.imageUrl}
          alt={currentStep.imageAlt}
          width={200}
          height={200}
          priority
          className="object-contain"
        />
      </motion.div>

      {/* Title and description */}
      <motion.div
        key={`${currentStep.id}-text`} // Re-animate when step changes
        {...animations.utils.createEntrance(0.2)}
      >
        <h1 className="text-hero font-bold text-primary mb-2">
          {currentStep.title}
        </h1>
        <p className="text-body text-secondary">{currentStep.description}</p>
      </motion.div>
    </OnboardingLayout>
  );
}
