import { invoke } from "@tauri-apps/api/core";

import { apiFetch } from "../auth/api";

export type VpnStep = "installing" | "registering" | "writing";

interface VpnConfig {
  address: string;
  dns: string | null;
  server: {
    publicKey: string;
    endpoint: string;
    allowedIps: string;
    persistentKeepalive: number;
  };
}

/**
 * Installs WireGuard if needed, registers a fresh public key with the API and
 * writes the tunnel config. Resolves with the config file path.
 */
export async function setupVpn(onStep: (step: VpnStep) => void): Promise<string> {
  if (!(await invoke<boolean>("wireguard_installed"))) {
    onStep("installing");
    await invoke("install_wireguard");
  }

  onStep("registering");
  const publicKey = await invoke<string>("vpn_public_key");
  const config = await apiFetch<VpnConfig>("/api/vpn/peer", {
    method: "POST",
    body: JSON.stringify({ publicKey }),
  });

  onStep("writing");
  return invoke<string>("write_vpn_config", { config });
}
