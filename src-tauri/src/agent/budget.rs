use std::time::Instant;

pub struct Budget {
    pub max_tool_calls: usize,
    pub max_duration_secs: u64,
    pub max_cost_usd: f64,
    pub tool_calls_used: usize,
    pub cost_usd_used: f64,
    pub started_at: Instant,
}

impl Default for Budget {
    fn default() -> Self {
        Self {
            max_tool_calls: 15,
            max_duration_secs: 60,
            max_cost_usd: 0.30,
            tool_calls_used: 0,
            cost_usd_used: 0.0,
            started_at: Instant::now(),
        }
    }
}

impl Budget {
    pub fn exceeded(&self) -> bool {
        self.tool_calls_used >= self.max_tool_calls
            || self.started_at.elapsed().as_secs() >= self.max_duration_secs
            || self.cost_usd_used >= self.max_cost_usd
    }
}
