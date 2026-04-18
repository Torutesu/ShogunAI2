use anyhow::Result;
use uuid::Uuid;

/// Stage 3: append-only store. 1 event = 1 transaction.
/// confidence < 0.5 → stored but NOT indexed (embedding skipped).
/// WAL enabled. Never UPDATE/DELETE except explicit user delete request.
pub async fn store_event(_event: &serde_json::Value) -> Result<Uuid> {
    todo!("Phase 2: implement store stage")
}
