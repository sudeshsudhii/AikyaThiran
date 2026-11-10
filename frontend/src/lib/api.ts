export type User = {
  id: number;
  email: string;
  name: string;
  picture: string | null;
  college: string | null;
  course: string | null;
  year_of_study: number | null;
  interests: string[];
  created_at: string;
  profile_complete: boolean;
};

export type ProfileUpdate = Partial<Pick<User, "name" | "college" | "course" | "year_of_study" | "interests">>;

const BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "Something went wrong. Try again.";
    throw new ApiError(res.status, detail);
  }
  return data as T;
}

export const api = {
  config: () => request<{ google_client_id: string }>("/api/auth/config"),
  me: () => request<User>("/api/auth/me"),
  loginWithGoogle: (credential: string) =>
    request<User>("/api/auth/google", { method: "POST", body: JSON.stringify({ credential }) }),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  updateProfile: (body: ProfileUpdate) =>
    request<User>("/api/users/me", { method: "PATCH", body: JSON.stringify(body) }),
};
