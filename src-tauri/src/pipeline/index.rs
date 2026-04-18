use anyhow::Result;
use uuid::Uuid;

/// Stage 4: entity extraction (ONNX NER, not LLM) + embedding.
/// Entity types: URL regex, email regex, file path regex,
///   person/org/project via multilingual NER ONNX model.
/// Embedding: voyage-3 (BYOK) or BGE-M3 (local), 512-token chunks.
/// Only events with confidence >= 0.5 are embedded.
/// On failure: retry 3x then dead-letter (meta.embedding_failed=true).
pub async fn index_event(_event_id: Uuid, _content: &str, _confidence: f32) -> Result<()> {
    todo!("Phase 2: implement index stage")
}
