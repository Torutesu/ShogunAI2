use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AudioChunk {
    pub transcript: String,
    pub avg_logprob: f32,
    pub speakers: Vec<String>,
    pub duration_ms: u32,
}

pub async fn transcribe_chunk(_audio_data: &[u8]) -> Result<AudioChunk> {
    // Phase 1: on-device whisper.cpp (large-v3-turbo, int8 quantized)
    // Diarization via ONNX runtime (pyannote-onnx equivalent)
    // NOT always-on: triggers on meeting app detection or manual start
    // Privacy: menu bar red dot while recording, notification every 10 min
    // SLA: realtime ratio ≤ 0.5x (30s audio processed in ≤15s)
    todo!("Phase 1: implement on-device whisper.cpp transcription")
}
