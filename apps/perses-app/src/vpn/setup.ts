import { invoke } from "@tauri-apps/api/core";

import { apiFetch } from "../auth/api";

export type VpnStep = "registering" | "writing" | "installing";

export interface VpnKeys {
  publicKey: string;
  privateKey: string;
}

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

export interface ProvisionedVpn {
  keys: VpnKeys;
  address: string;
  path: string;
}

/**
 * Loads the device key pair (created on first run), registers its public half
 * with the API and writes the tunnel config.
 */
export async function provisionVpn(onStep: (step: VpnStep) => void): Promise<ProvisionedVpn> {
  const keys = await invoke<VpnKeys>("vpn_keys");

  onStep("registering");
  const config = await apiFetch<VpnConfig>("/api/vpn/peer", {
    method: "POST",
    body: JSON.stringify({ publicKey: keys.publicKey }),
  });

  onStep("writing");
  const path = await invoke<string>("write_vpn_config", { config });

  return { keys, address: config.address, path };
}

export async function ensureWireguard(onStep: (step: VpnStep) => void): Promise<void> {
  if (await invoke<boolean>("wireguard_installed")) return;

  onStep("installing");
  await invoke("install_wireguard");
}
