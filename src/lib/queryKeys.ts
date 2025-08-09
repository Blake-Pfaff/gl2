export const qk = {
  me: ["me"] as const,
  user: (id: string) => ["user", id] as const,
};
