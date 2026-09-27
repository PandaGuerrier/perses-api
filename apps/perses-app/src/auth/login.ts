import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { openUrl } from "@tauri-apps/plugin-opener";

import { API_URL, apiFetch } from "./api";
import { createPkcePair } from "./pkce";

/**
 * Opens Ferriskey in the system browser through the API, then waits for the
 * API to bounce back to our loopback listener with a one-shot code.
 */
export async function loginWithBrowser(): Promise<string> {
  const { verifier, challenge } = await createPkcePair();

  let unlisten: (() => void) | undefined;
  const callback = new Promise<string>((resolve) => {
    listen<string>("auth-callback", (event) => resolve(event.payload)).then((fn) => {
      unlisten = fn;
    });
  });

  try {
    const port = await invoke<number>("start_auth_listener");
    const params = new URLSearchParams({ port: String(port), challenge });
    await openUrl(`${API_URL}/auth/desktop/redirect?${params}`);

    const query = new URLSearchParams(await callback);
    const code = query.get("code");
    if (!code) throw new Error(query.get("error") ?? "login_failed");

    const { token } = await apiFetch<{ token: string }>("/api/auth/desktop/token", {
      method: "POST",
      body: JSON.stringify({ code, verifier }),
    });
    return token;
  } finally {
    unlisten?.();
  }
}
