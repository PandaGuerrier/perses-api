use std::io::{Read, Write};
use std::net::TcpListener;
use std::time::{Duration, Instant};

use tauri::{AppHandle, Emitter};

const LOGIN_TIMEOUT: Duration = Duration::from_secs(300);

const DONE_PAGE: &str = "<!doctype html><html lang=\"fr\"><meta charset=\"utf-8\"><title>Perses</title>\
<body style=\"font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0\">\
<p>Connexion terminée, vous pouvez fermer cet onglet et revenir dans Perses.</p></body></html>";

/// Loopback redirect target for the OIDC handoff (RFC 8252 §7.3): binds an
/// ephemeral port, returns it, and emits `auth-callback` with the query string
/// of the first `/callback` hit.
#[tauri::command]
pub fn start_auth_listener(app: AppHandle) -> Result<u16, String> {
    let listener = TcpListener::bind("127.0.0.1:0").map_err(|e| e.to_string())?;
    let port = listener.local_addr().map_err(|e| e.to_string())?.port();
    listener.set_nonblocking(true).map_err(|e| e.to_string())?;

    std::thread::spawn(move || {
        let started = Instant::now();

        while started.elapsed() < LOGIN_TIMEOUT {
            let (mut stream, _) = match listener.accept() {
                Ok(conn) => conn,
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    std::thread::sleep(Duration::from_millis(100));
                    continue;
                }
                Err(_) => break,
            };

            let _ = stream.set_nonblocking(false);
            let _ = stream.set_read_timeout(Some(Duration::from_secs(5)));
            let mut buf = [0u8; 8192];
            let read = stream.read(&mut buf).unwrap_or(0);
            let request = String::from_utf8_lossy(&buf[..read]);

            // "GET /callback?code=... HTTP/1.1"
            let target = request.split_whitespace().nth(1).unwrap_or("");
            let Some(query) = target.strip_prefix("/callback?") else {
                let _ = stream.write_all(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n");
                continue;
            };

            let response = format!(
                "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                DONE_PAGE.len(),
                DONE_PAGE
            );
            let _ = stream.write_all(response.as_bytes());
            let _ = app.emit("auth-callback", query.to_string());
            return;
        }

        let _ = app.emit("auth-callback", "error=timeout".to_string());
    });

    Ok(port)
}
