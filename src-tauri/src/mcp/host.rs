use anyhow::Result;
use serde_json::Value;

/// MCP host: connects to external MCP servers (stdio/http).
/// External servers: Gmail, Google Calendar, Slack, Notion, GitHub, Linear, Browser.
/// Core 7 tools are implemented locally in src/mcp/tools/ (Phase 4).
pub struct McpHost;

impl McpHost {
    pub async fn list_tools(&self) -> Result<Vec<Value>> {
        todo!("Phase 4: discover tools from connected MCP servers")
    }

    pub async fn call_tool(&self, _tool_name: &str, _input: Value) -> Result<Value> {
        todo!("Phase 4: dispatch tool call to correct MCP server")
    }
}
