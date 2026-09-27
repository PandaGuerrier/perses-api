import type { ReactNode } from "react";

import { useAuth } from "./AuthProvider";

const ERRORS: Record<string, string> = {
  access_denied: "Connexion refusée par Ferriskey.",
  timeout: "La connexion a expiré, réessayez.",
};

/** Nothing below this component renders without an authenticated user. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { state, login } = useAuth();

  if (state.status === "authenticated") return <>{children}</>;

  if (state.status === "loading") {
    return <main className="container">Chargement…</main>;
  }

  return (
    <main className="container">
      <h1>Perses</h1>
      <p>Connectez-vous avec votre compte pour accéder à l'application.</p>
      <div className="row">
        <button type="button" onClick={login} disabled={state.status === "authenticating"}>
          {state.status === "authenticating"
            ? "Terminez la connexion dans votre navigateur…"
            : "Se connecter avec Ferriskey"}
        </button>
      </div>
      {state.status === "anonymous" && state.error && (
        <p role="alert">{ERRORS[state.error] ?? "La connexion a échoué, réessayez."}</p>
      )}
    </main>
  );
}
