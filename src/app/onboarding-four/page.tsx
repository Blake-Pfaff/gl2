"use client";

import { motion } from "framer-motion";
import { animations } from "@/lib/animations";
import OnboardingLayout from "../components/OnboardingLayout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function OnboardingFourPage() {
  const router = useRouter();
  const { update } = useSession();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleGetStarted = async () => {
    setIsCompleting(true);
    try {
      // Mark user as onboarded
      const response = await fetch("/api/user/onboarding-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Refresh the session to get updated user data from the database
        await update();

        // Navigate to the main app - the session should now show isOnboarded: true
        router.push("/");

        // Refresh the page to ensure middleware and all auth checks see the updated state
        router.refresh();
      } else {
        console.error("Failed to complete onboarding");
        // Still navigate even if the API call fails
        router.push("/users");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Still navigate even if there's an error
      router.push("/users");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={4}
      nextRoute="/users"
      nextButtonText={isCompleting ? "Completing..." : "Get Started"}
      onNextClick={handleGetStarted}
    >
      {/* Hero area */}
      <motion.div
        className="p-component flex items-center justify-center mb-section min-h-[220px]"
        {...animations.utils.createEntrance(0.1)}
      >
        <Image
          src="/glv2Confident.png"
          alt={"Goldy looking confident"}
          width={200}
          height={200}
          priority
          className="object-contain"
        />
      </motion.div>

      {/* Title and description */}
      <motion.div {...animations.utils.createEntrance(0.2)}>
        <h1 className="text-hero font-bold text-primary mb-2">You got this!</h1>
        <p className="text-body text-secondary">
          Now you can feel confident about expressing your feelings because
          Goldy always has your back.
        </p>
      </motion.div>
    </OnboardingLayout>
  );
}
