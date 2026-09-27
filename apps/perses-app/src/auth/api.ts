export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

const TOKEN_KEY = "perses.token";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export class UnauthorizedError extends Error {}

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (response.status === 401) throw new UnauthorizedError();
  if (!response.ok) throw new Error(`API ${response.status} on ${path}`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
