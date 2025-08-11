// src/hooks/usePhoneNumber.ts
import { useApiMutation, useApiQuery } from "./useApi";
import { qk } from "@/lib/queryKeys";

export type PhoneNumberData = {
  phoneNumber: string;
  countryCode: string;
};

export type PhoneNumberResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    isOnboarded: boolean;
    lastOnlineAt: Date | null;
  };
};

// Hook to update user's phone number
export function useUpdatePhoneNumber() {
  return useApiMutation<PhoneNumberResponse, PhoneNumberData>(
    "/api/user/phone",
    "PUT",
    {
      // Optimistic updates and cache invalidation
      onSuccess: () => {
        // Invalidate and refetch phone number query
        // Note: In a full app, you'd use queryClient.invalidateQueries here
        console.log("Phone number updated successfully");
      },
      onError: (error) => {
        // Enhanced error logging for debugging
        console.error("Phone update failed:", {
          error,
          timestamp: new Date().toISOString(),
        });
      },
    }
  );
}

// Hook to get user's current phone number
export function useGetPhoneNumber() {
  return useApiQuery<{ phone: string | null }>(
    qk.phone, // Use consistent query key
    "/api/user/phone",
    {
      staleTime: 5 * 60 * 1000, // 5 minutes - phone numbers don't change often
      cacheTime: 10 * 60 * 1000, // 10 minutes in cache
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 (auth errors)
        if (error?.status === 401 || error?.status === 403) return false;
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
    }
  );
}

export type VerificationData = {
  phoneNumber: string;
  code: string;
};

export type VerificationResponse = {
  message: string;
  verified: boolean;
};

// Hook to verify phone number with code
export function useVerifyPhoneNumber() {
  return useApiMutation<VerificationResponse, VerificationData>(
    "/api/user/verify-phone",
    "POST"
  );
}
