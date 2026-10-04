import { useCallback, useEffect, useRef, useState } from "react";

import { AuthGate } from "./auth/AuthGate";
import { AuthProvider, useAuth, useUser } from "./auth/AuthProvider";
import { ensureWireguard, provisionVpn, type ProvisionedVpn, type VpnStep } from "./vpn/setup";
import "./App.css";

const VPN_STEPS: Record<VpnStep, string> = {
  registering: "Enregistrement auprès du serveur…",
  writing: "Écriture de la configuration…",
  installing: "Installation de WireGuard…",
};

type VpnStatus =
  | { status: "running"; step?: VpnStep }
  | { status: "ready" }
  | { status: "error"; message: string };

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function useVpnSetup() {
  const [vpn, setVpn] = useState<ProvisionedVpn | null>(null);
  const [status, setStatus] = useState<VpnStatus>({ status: "running" });

  const run = useCallback(async () => {
    const onStep = (step: VpnStep) => setStatus({ status: "running", step });
    setStatus({ status: "running" });
    try {
      setVpn(await provisionVpn(onStep));
      await ensureWireguard(onStep);
      setStatus({ status: "ready" });
    } catch (error) {
      setStatus({ status: "error", message: errorMessage(error) });
    }
  }, []);

  // StrictMode mounts twice in dev; one provisioning per login is enough.
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
  }, [run]);

  return { vpn, status, retry: run };
}

function VpnKeysPanel({ vpn }: { vpn: ProvisionedVpn }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <dl className="vpn-keys">
      <dt>Adresse</dt>
      <dd>
        <code>{vpn.address}</code>
      </dd>
      <dt>Clé publique</dt>
      <dd>
        <code>{vpn.keys.publicKey}</code>
      </dd>
      <dt>Clé privée</dt>
      <dd>
        <code>{revealed ? vpn.keys.privateKey : "•".repeat(44)}</code>
        <button type="button" onClick={() => setRevealed(!revealed)}>
          {revealed ? "Masquer" : "Afficher"}
        </button>
      </dd>
      <dt>Configuration</dt>
      <dd>
        <code>{vpn.path}</code>
      </dd>
    </dl>
  );
}

function Home() {
  const user = useUser();
  const { logout } = useAuth();
  const { vpn, status, retry } = useVpnSetup();

  return (
    <main className="container">
      <h1>Bonjour {user.fullName || user.email}</h1>
      {status.status === "running" && <p>{status.step ? VPN_STEPS[status.step] : "Préparation du VPN…"}</p>}
      {status.status === "ready" && <p>VPN prêt.</p>}
      {status.status === "error" && (
        <p role="alert">
          {status.message}{" "}
          <button type="button" onClick={retry}>
            Réessayer
          </button>
        </p>
      )}
      {vpn && <VpnKeysPanel vpn={vpn} />}
      <div className="row">
        <button type="button" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <Home />
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
