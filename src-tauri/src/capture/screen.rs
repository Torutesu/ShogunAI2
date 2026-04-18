use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ScreenEvent {
    pub bundle_id: String,
    pub app_name: String,
    pub window_title: String,
    pub url: Option<String>,
    pub content: String,
    /// true = OCR fallback was used (confidence ≤ 0.7)
    pub fallback: bool,
}

pub async fn capture_active_window() -> Result<Option<ScreenEvent>> {
    // Phase 1: Accessibility API primary path
    // Primary: AXUIElementCopyAttributeValue → structured text
    // Fallback: CGWindowListCreateImage → VNRecognizeTextRequest (OCR only if primary fails)
    // Privacy: skip AXSecureTextField windows, skip incognito, check settings.blocklist
    // SLA: p95 < 500ms from window-change to events row insertion
    todo!("Phase 1: implement screen capture via macOS Accessibility API")
}
