import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { apiFetch, tokenStore, UnauthorizedError, type AuthUser } from "./api";
import { loginWithBrowser } from "./login";

type AuthState =
  | { status: "loading" }
  | { status: "anonymous"; error?: string }
  | { status: "authenticating" }
  | { status: "authenticated"; user: AuthUser };

interface AuthContextValue {
  state: AuthState;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMe(): Promise<AuthState> {
  try {
    return { status: "authenticated", user: await apiFetch<AuthUser>("/api/me") };
  } catch (error) {
    if (error instanceof UnauthorizedError) tokenStore.clear();
    return { status: "anonymous" };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    if (!tokenStore.get()) {
      setState({ status: "anonymous" });
      return;
    }
    fetchMe().then(setState);
  }, []);

  const login = useCallback(async () => {
    setState({ status: "authenticating" });
    try {
      tokenStore.set(await loginWithBrowser());
      setState(await fetchMe());
    } catch (error) {
      setState({ status: "anonymous", error: (error as Error).message });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/token", { method: "DELETE" });
    } finally {
      tokenStore.clear();
      setState({ status: "anonymous" });
    }
  }, []);

  return <AuthContext.Provider value={{ state, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function useUser(): AuthUser {
  const { state } = useAuth();
  if (state.status !== "authenticated") throw new Error("useUser requires an authenticated session");
  return state.user;
}
