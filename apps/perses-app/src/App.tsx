import { useState } from "react";

import { AuthGate } from "./auth/AuthGate";
import { AuthProvider, useAuth, useUser } from "./auth/AuthProvider";
import { setupVpn, type VpnStep } from "./vpn/setup";
import "./App.css";

const VPN_STEPS: Record<VpnStep, string> = {
  installing: "Installation de WireGuard…",
  registering: "Enregistrement auprès du serveur…",
  writing: "Écriture de la configuration…",
};

type VpnState =
  | { status: "idle" }
  | { status: "running"; step?: VpnStep }
  | { status: "done"; path: string }
  | { status: "error"; message: string };

function Home() {
  const user = useUser();
  const { logout } = useAuth();
  const [vpn, setVpn] = useState<VpnState>({ status: "idle" });

  const configureVpn = async () => {
    setVpn({ status: "running" });
    try {
      const path = await setupVpn((step) => setVpn({ status: "running", step }));
      setVpn({ status: "done", path });
    } catch (error) {
      setVpn({ status: "error", message: error instanceof Error ? error.message : String(error) });
    }
  };

  return (
    <main className="container">
      <h1>Bonjour {user.fullName || user.email}</h1>
      <div className="row">
        <button type="button" onClick={configureVpn} disabled={vpn.status === "running"}>
          {vpn.status === "running" && vpn.step ? VPN_STEPS[vpn.step] : "Configurer le VPN"}
        </button>
        <button type="button" onClick={logout}>
          Se déconnecter
        </button>
      </div>
      {vpn.status === "done" && <p>Configuration VPN écrite dans {vpn.path}</p>}
      {vpn.status === "error" && <p role="alert">{vpn.message}</p>}
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
