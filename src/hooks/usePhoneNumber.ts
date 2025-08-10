// src/hooks/usePhoneNumber.ts
import { useApiMutation, useApiQuery } from "./useApi";

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
    "PUT"
  );
}

// Hook to get user's current phone number
export function useGetPhoneNumber() {
  return useApiQuery<{ phone: string | null }>("/api/user/phone");
}
