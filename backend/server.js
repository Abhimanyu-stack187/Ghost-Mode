const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const si = require("systeminformation");
const { spawn } = require("child_process");
const path = require("path");

const RISK_ENGINE_DIR = path.join(__dirname, "rust", "risk-engine");
const RISK_MIN_SEVERITY = process.env.RISK_MIN_SEVERITY || "medium";
const severityRank = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
};

const ignoredProcesses = [
    "rapportd",
    "sharingd",
    "airportd",
    "symptomsd",
    "mDNSResponder",
    "identityservicesd",
    "wifivelocityd",
    "wifianalyticsd",
    "wifip2pd",
    "apsd"
];

const trackerMap = {
    "142.250": {
        company: "Google",
        category: "Analytics",
        risk: "medium"
    },

    "172.64": {
        company: "Cloudflare",
        category: "Infrastructure",
        risk: "low"
    },

    "57.144": {
        company: "WhatsApp",
        category: "Messaging",
        risk: "low"
    },

    "104.18": {
        company: "Cloudflare",
        category: "Infrastructure",
        risk: "low"
    },

    "140.82": {
        company: "GitHub",
        category: "Development",
        risk: "low"
    }
};

function classifyConnection(ip, process) {

    for (const prefix in trackerMap) {
        if (ip.startsWith(prefix)) {
            return trackerMap[prefix];
        }
    }

    if (process.includes("ChatGPT")) {
        return {
            company: "OpenAI",
            category: "AI",
            risk: "low"
        };
    }

    return {
        company: "Unknown",
        category: "Unknown",
        risk: "medium"
    };
}

function isRiskWorthy(event) {
    const severity = event.severity || event.risk || "low";
    return (severityRank[severity] || 0) >= (severityRank[RISK_MIN_SEVERITY] || severityRank.medium);
}

async function calculateRisk(event) {

    return new Promise((resolve, reject) => {

        const rust = spawn(
            "cargo",
            ["run", "--quiet"],
            {
                cwd: RISK_ENGINE_DIR
            }
        );

        let output = "";

        rust.stdout.on("data", data => {
            output += data.toString();
        });

        rust.stderr.on("data", data => {
            console.error("Rust Error:");
            console.error(data.toString());
        });

        rust.on("close", () => {
            try {
                const result = JSON.parse(output);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });

        rust.stdin.write(JSON.stringify({
            company: event.company,
            category: event.category,
            connectionCount: event.connectionCount
        }));

        rust.stdin.end();
    });
}

const app = express();

app.use(cors());

app.get("/api/health", (req, res) => {
    res.json({
        status: "GhostMode backend running"
    });
});

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({
    server,
    path: "/telemetry"
});

console.log(`WebSocket running on ws://localhost:${PORT}/telemetry`);

async function scanConnections() {
    try {

        console.log("Scanning telemetry...");

        const connections = await si.networkConnections();

        const filteredConnections = connections
            .filter(conn => {

                if (!conn.peerAddress) return false;

                if (conn.state !== "ESTABLISHED") return false;

                if (
                    conn.localAddress === "127.0.0.1" ||
                    conn.localAddress === "::1"
                ) {
                    return false;
                }

                return !ignoredProcesses.some(proc =>
                    conn.process?.includes(proc)
                );
            });

        const groupedConnections = {};

        filteredConnections.forEach(conn => {

            const key = `${conn.process}-${conn.peerAddress}`;

            if (!groupedConnections[key]) {

                const classification = classifyConnection(
                    conn.peerAddress,
                    conn.process || ""
                );

                groupedConnections[key] = {
                    type: "outbound_connection",
                    process: conn.process || "unknown",
                    ip: conn.peerAddress,
                    port: conn.peerPort,
                    protocol: conn.protocol,
                    company: classification.company,
                    category: classification.category,
                    risk: classification.risk,
                    connectionCount: 1,
                    timestamp: Date.now()
                };

            } else {
                groupedConnections[key].connectionCount += 1;
            }
        });

        const events = Object.values(groupedConnections).slice(0, 10);

        for (const event of events) {

            try {
                const riskResult = await calculateRisk(event);

                event.riskScore = riskResult.score;
                event.severity = riskResult.severity;

            } catch (err) {
                console.error("Risk engine failed:");
                console.error(err);
            }
        }

        const riskEvents = events.filter(isRiskWorthy);

        console.clear();
        console.log("GHOSTMODE RISK TELEMETRY");
        console.log(`Broadcasting ${riskEvents.length} risk events from ${events.length} observed connection groups`);
        console.log(riskEvents);

        riskEvents.forEach(event => {
            const json = JSON.stringify({
                ...event,
                activeConnections: filteredConnections.length,
                riskScore: event.riskScore,
                severity: event.severity
            });

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(json);
                }
            });
        });

    } catch (err) {
        console.error("SCAN ERROR:");
        console.error(err);
    }
}

wss.on("connection", () => {
    scanConnections();
});

setInterval(scanConnections, 3000);
