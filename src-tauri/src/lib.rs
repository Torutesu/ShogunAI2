pub mod agent;
pub mod capture;
pub mod db;
pub mod license;
pub mod mcp;
pub mod pipeline;

use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let data_dir = app.path().app_data_dir()?;
            tracing_subscriber::fmt()
                .with_env_filter(
                    tracing_subscriber::EnvFilter::from_default_env()
                        .add_directive("shogun=debug".parse().unwrap()),
                )
                .init();
            tracing::info!("SHOGUN v2 starting, data_dir={:?}", data_dir);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error running SHOGUN");
}
