use anyhow::Result;

pub struct NormalizedEvent {
    pub content: String,
    pub content_hash: String,
    pub confidence: f32,
    pub lang: String,
    pub meta: serde_json::Value,
}

/// Stage 2: deterministic normalization (no LLM).
/// NFKC + whitespace collapse, URL tracking-param strip,
/// bundle_id → canonical app name, language detection (whatlang),
/// SHA-256 content_hash, confidence final assignment.
pub fn normalize(_raw_content: &str, _fallback: bool) -> Result<NormalizedEvent> {
    todo!("Phase 2: implement normalize stage")
}
