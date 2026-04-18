use serde::{Deserialize, Serialize};

/// Activity summary per app. Default OFF — explicit opt-in required.
/// Records duration only, NEVER keystrokes.
#[derive(Debug, Serialize, Deserialize)]
pub struct InputActivity {
    pub app: String,
    pub duration_ms: u64,
}
