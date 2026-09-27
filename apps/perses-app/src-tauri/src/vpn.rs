use std::path::PathBuf;
use std::process::Command;
use std::sync::Mutex;

use base64::{engine::general_purpose::STANDARD, Engine};
use rand_core::OsRng;
use serde::Deserialize;
use tauri::{AppHandle, Manager, State};
use x25519_dalek::{PublicKey, StaticSecret};

const TUNNEL_NAME: &str = "perses";

/// Private key generated for the in-flight provisioning: it waits here while
/// the public half goes to the API, and only ever leaves the process inside
/// the config file.
#[derive(Default)]
pub struct PendingKey(Mutex<Option<StaticSecret>>);

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ServerPeer {
    public_key: String,
    endpoint: String,
    allowed_ips: String,
    persistent_keepalive: u16,
}

/// Shape returned by `POST /api/vpn/peer`.
#[derive(Deserialize)]
pub struct VpnConfig {
    address: String,
    dns: Option<String>,
    server: ServerPeer,
}

/// GUI apps don't inherit the shell PATH (Homebrew is invisible on macOS), so
/// look in the known install locations rather than relying on `which`.
fn wg_binary() -> Option<PathBuf> {
    let candidates: &[&str] = if cfg!(target_os = "windows") {
        &[r"C:\Program Files\WireGuard\wireguard.exe"]
    } else if cfg!(target_os = "macos") {
        &["/opt/homebrew/bin/wg-quick", "/usr/local/bin/wg-quick"]
    } else {
        &["/usr/bin/wg-quick", "/usr/local/bin/wg-quick"]
    };

    candidates.iter().map(PathBuf::from).find(|p| p.exists())
}

fn run(command: &mut Command) -> Result<(), String> {
    let output = command.output().map_err(|e| e.to_string())?;
    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
    }
}

#[cfg(target_os = "macos")]
fn install() -> Result<(), String> {
    let brew = ["/opt/homebrew/bin/brew", "/usr/local/bin/brew"]
        .into_iter()
        .find(|p| std::path::Path::new(p).exists())
        .ok_or("Homebrew est requis pour installer WireGuard (https://brew.sh).")?;

    run(Command::new(brew).args(["install", "wireguard-tools"]))
}

#[cfg(target_os = "linux")]
fn install() -> Result<(), String> {
    const SCRIPT: &str = "if command -v apt-get >/dev/null; then apt-get install -y wireguard-tools; \
        elif command -v dnf >/dev/null; then dnf install -y wireguard-tools; \
        elif command -v pacman >/dev/null; then pacman -S --noconfirm wireguard-tools; \
        else echo 'Gestionnaire de paquets non supporté' >&2; exit 1; fi";

    run(Command::new("pkexec").args(["sh", "-c", SCRIPT]))
}

#[cfg(target_os = "windows")]
fn install() -> Result<(), String> {
    // The official bootstrapper fetches the latest MSI and asks for elevation itself.
    const SCRIPT: &str = "$ErrorActionPreference = 'Stop'; \
        $installer = Join-Path $env:TEMP 'wireguard-installer.exe'; \
        Invoke-WebRequest -UseBasicParsing https://download.wireguard.com/windows-client/wireguard-installer.exe -OutFile $installer; \
        Start-Process -FilePath $installer -Verb RunAs -Wait";

    run(Command::new("powershell").args(["-NoProfile", "-NonInteractive", "-Command", SCRIPT]))
}

#[tauri::command]
pub fn wireguard_installed() -> bool {
    wg_binary().is_some()
}

#[tauri::command]
pub async fn install_wireguard() -> Result<(), String> {
    if wg_binary().is_some() {
        return Ok(());
    }

    tauri::async_runtime::spawn_blocking(install)
        .await
        .map_err(|e| e.to_string())??;

    wg_binary()
        .map(|_| ())
        .ok_or_else(|| "WireGuard n'a pas été trouvé après l'installation.".to_string())
}

/// Generates a fresh key pair and returns the public key to register with the API.
#[tauri::command]
pub fn vpn_public_key(pending: State<PendingKey>) -> String {
    let secret = StaticSecret::random_from_rng(OsRng);
    let public = PublicKey::from(&secret);
    *pending.0.lock().unwrap() = Some(secret);

    STANDARD.encode(public.as_bytes())
}

/// Writes `<app config dir>/perses.conf` from the API answer and the pending
/// private key, and returns its path.
#[tauri::command]
pub fn write_vpn_config(
    app: AppHandle,
    pending: State<PendingKey>,
    config: VpnConfig,
) -> Result<String, String> {
    let secret = pending
        .0
        .lock()
        .unwrap()
        .take()
        .ok_or("Aucune clé en attente : appelez vpn_public_key d'abord.")?;

    let dns = config
        .dns
        .map(|dns| format!("DNS = {dns}\n"))
        .unwrap_or_default();
    let content = format!(
        "[Interface]\nPrivateKey = {}\nAddress = {}\n{dns}\n[Peer]\nPublicKey = {}\nEndpoint = {}\nAllowedIPs = {}\nPersistentKeepalive = {}\n",
        STANDARD.encode(secret.to_bytes()),
        config.address,
        config.server.public_key,
        config.server.endpoint,
        config.server.allowed_ips,
        config.server.persistent_keepalive,
    );

    let dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{TUNNEL_NAME}.conf"));
    std::fs::write(&path, content).map_err(|e| e.to_string())?;

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(&path, std::fs::Permissions::from_mode(0o600))
            .map_err(|e| e.to_string())?;
    }

    Ok(path.to_string_lossy().into_owned())
}
