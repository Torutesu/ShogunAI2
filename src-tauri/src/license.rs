use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub enum Plan { Trial, Monthly, Annual }

#[derive(Debug, Serialize, Deserialize)]
pub struct License {
    pub plan: Plan,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub device_id: String,
}

/// Verify JWT from Supabase Keychain entry (never from JSON config).
/// Offline grace: 14 days, then degrades to Trial.
pub async fn verify_license() -> Result<License> {
    todo!("Phase 5: implement license verification via Supabase JWT")
}
