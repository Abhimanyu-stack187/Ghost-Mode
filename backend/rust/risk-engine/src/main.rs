use serde::{Deserialize, Serialize};
use std::io::{self, Read};

#[derive(Deserialize)]
struct TelemetryEvent {
    company: String,
    category: String,
    #[serde(rename = "connectionCount")]
    connection_count: u32,
}

#[derive(Serialize)]
struct RiskResult {
    score: u32,
    severity: String,
}

fn calculate_risk(event: &TelemetryEvent) -> RiskResult {

    let mut score = 0;

    match event.category.as_str() {
        "Analytics" => score += 10,
        "Messaging" => score += 3,
        "Infrastructure" => score += 1,
        "Development" => score += 1,
        "AI" => score += 1,
        _ => score += 5,
    }

    if event.company == "Unknown" {
        score += 2;
    }

    score += event.connection_count * 2;

    let severity = if score > 15 {
        "high"
    } else if score > 7 {
        "medium"
    } else {
        "low"
    };

    RiskResult {
        score,
        severity: severity.to_string(),
    }
}

fn main() {

    let mut input = String::new();

    io::stdin()
        .read_to_string(&mut input)
        .unwrap();

    let event: TelemetryEvent =
        serde_json::from_str(&input).unwrap();

    let result = calculate_risk(&event);

    println!(
        "{}",
        serde_json::to_string(&result).unwrap()
    );
}
