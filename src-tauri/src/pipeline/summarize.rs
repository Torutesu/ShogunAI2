use anyhow::Result;

pub enum SummarySpan { Session, Hour, Day, Week, Brief }

/// Stage 5 — Dream Cycle (trigger-based + idle-aware, NOT cron).
/// Triggers: session close (90s gap), hour rollup (:05), day rollup
/// (first idle >10min), week rollup (Mon 06:00 local).
/// LLM: claude-sonnet-4-5 via Anthropic API (BYOK respected).
/// Quality gate: all highlights[].event_id MUST exist in events table.
pub async fn summarize(_span: SummarySpan, _span_start: chrono::DateTime<chrono::Utc>) -> Result<()> {
    todo!("Phase 3: implement Dream Cycle summarize stage")
}
