import { useApiQuery, useApiMutation } from "./useApi";
import { ONBOARDING_QUERY_KEYS } from "@/lib/queryKeys";

export interface OnboardingStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export function useOnboardingSteps() {
  return useApiQuery<OnboardingStep[]>(
    ONBOARDING_QUERY_KEYS.steps(),
    "/api/onboarding-steps"
  );
}

export function useCompleteOnboarding() {
  return useApiMutation("/api/user/onboarding-complete", "POST");
}
