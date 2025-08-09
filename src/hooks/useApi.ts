import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { fetchJson } from "@/lib/apiClient";

export function useApiQuery<T>(
  key: readonly unknown[],
  path: string,
  opts?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => fetchJson<T>(path),
    ...opts,
  });
}

export function useApiMutation<TOut, TVars = unknown>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  opts?: UseMutationOptions<TOut, unknown, TVars>
) {
  return useMutation<TOut, unknown, TVars>({
    mutationFn: (vars) =>
      fetchJson<TOut>(path, {
        method,
        body: typeof vars === "string" ? vars : JSON.stringify(vars),
      }),
    ...opts,
  });
}
