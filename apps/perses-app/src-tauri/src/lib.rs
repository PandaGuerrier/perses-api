mod auth;
mod vpn;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            auth::start_auth_listener,
            vpn::wireguard_installed,
            vpn::install_wireguard,
            vpn::vpn_keys,
            vpn::write_vpn_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
