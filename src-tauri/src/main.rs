#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

use tauri_plugin_websocket::TauriWebsocket;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .plugin(TauriWebsocket::default())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
