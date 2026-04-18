use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ToolCall {
    pub tool: String,
    pub input: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Plan {
    pub tool_calls: Vec<ToolCall>,
}

/// Calls Anthropic API Tool Use to produce a DAG of tool_calls.
/// Model: claude-sonnet-4-5 (or user BYOK model from settings).
pub async fn plan(_intent: &str, _tool_schemas: &[serde_json::Value]) -> Result<Plan> {
    todo!("Phase 4: implement planner via Anthropic API tool use")
}
