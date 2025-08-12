export const qk = {
  me: ["me"] as const,
  user: (id: string) => ["user", id] as const,
  users: (page: number, limit: number) => ["users", { page, limit }] as const,
  phone: ["phone"] as const,
};

export const ONBOARDING_QUERY_KEYS = {
  steps: () => ["onboarding", "steps"] as const,
} as const;
