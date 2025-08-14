import { useApiQuery } from "./useApi";

export function useProfile() {
  return useApiQuery<{
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      username?: string | null;
      bio?: string | null;
      jobTitle?: string | null;
      birthdate?: string | null;
      gender?: string | null;
      lookingFor?: string | null;
      locationLabel?: string | null;
      photos: Array<{
        id: string;
        url: string;
        caption?: string | null;
        order: number;
        isMain: boolean;
      }>;
    };
  }>(["profile"], "/api/user/profile");
}
