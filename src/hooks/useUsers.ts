import { useApiQuery } from "@/hooks/useApi";
import { qk } from "@/lib/queryKeys";

interface User {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  jobTitle: string | null;
  locationLabel: string | null;
  photos: { url: string }[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

export function useUsers(
  page: number,
  limit: number = 12,
  enabled: boolean = true
) {
  return useApiQuery<UsersResponse>(
    qk.users(page, limit),
    `/api/users?page=${page}&limit=${limit}`,
    {
      enabled,
    }
  );
}

export type { User, PaginationInfo, UsersResponse };
