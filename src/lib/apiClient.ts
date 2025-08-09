export type ApiError = { status: number; message: string; details?: unknown };

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = (j as any)?.error || msg;
    } catch {}
    const err: ApiError = { status: res.status, message: msg };
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
