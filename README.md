# 🥷 GhostMode — Digital Shadow Observability Platform

GhostMode is a state-of-the-art telemetry and privacy-observability dashboard. It provides a visual dashboard to observe your digital shadow in real time: dark, quiet, precise, and alive with simulated and real telemetry.

---

## 🚀 Getting Started

To get the application up and running locally, follow these steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) along with `npm` or `yarn`.

### 2. Clone the Repository
```bash
git clone <your-repository-url>
cd ghostmode
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Copy the configuration template to create your local environment file:
```bash
cp .env.example .env.local
```
*(On Windows PowerShell, use: `copy .env.example .env.local`)*

By default, `VITE_USE_MOCK_DATA` is set to `true`, which enables the built-in telemetry simulation.

### 5. Run the Project
Start the local development server:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser to view the application.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 18 (TypeScript) + Vite for lightning-fast bundling.
- **Styling**: Tailwind CSS for responsive layouts and custom glassmorphism.
- **Animations**: Framer Motion for premium micro-animations and entrance states.
- **Data & Icons**: Lucide React for consistent indicators, and D3-based graphs.

### Project Structure
```text
ghostmode/
├── docs/                     # Design systems & developer guides
├── src/
│   ├── app/                  # Main entry, router, and root app component
│   ├── components/
│   │   ├── layout/           # AppShell, Sidebar, and TopBar navigation
│   │   ├── motion/           # Motion presets and framer-motion setups
│   │   └── ui/               # Reusable UI controls (GlassPanel, CyberButton, StatusDot)
│   ├── contexts/             # Global states (Notifications, Simulation)
│   ├── data/                 # Mock telemetry datasets for local development
│   ├── features/             # Feature-specific components (Overview, Dashboard panels)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # High-level route views (Overview, DigitalShadow, Leaks, etc.)
│   ├── services/             # Core service layers & Telemetry transport adapters
│   ├── styles/               # Global CSS, Tailwind tokens, and glassmorphism rules
│   └── types/                # TypeScript interface declarations
├── .env.example              # Environment configuration template
├── tailwind.config.ts        # Design tokens, custom animations, and palette configurations
└── vite.config.ts            # Build & plugin configurations
```

---

## 🔌 Connecting to a Backend (Workflow Guide)

GhostMode is designed with a decoupled architecture. All data fetching goes through a transport abstraction located in [telemetry.ts](file:///src/services/telemetry.ts).

### How Data Transport Works
The app defines a `TelemetryTransport` interface:
```typescript
export interface TelemetryTransport {
  request<K extends TelemetryChannel>(
    channel: K, 
    payload?: TelemetryRequestMap[K]
  ): Promise<TelemetryChannelMap[K]>;
}
```

By default, the app initializes with `createMockTelemetryTransport()`.

### Step-by-Step Backend Integration
Teammates working on backend connectivity should follow this workflow:

1. **Implement a Backend Transport**:
   Create a new transport file (e.g., `src/services/backendTelemetry.ts`) that fetches data from your backend server:
   ```typescript
   import { TelemetryTransport, TelemetryChannel, TelemetryChannelMap, TelemetryRequestMap } from "./telemetry";

   export class HttpTelemetryTransport implements TelemetryTransport {
     private baseUrl = import.meta.env.VITE_API_URL;

     async request<K extends TelemetryChannel>(
       channel: K, 
       payload?: TelemetryRequestMap[K]
     ): Promise<TelemetryChannelMap[K]> {
       // Convert channels like "telemetry:exposure" to API endpoints like "/telemetry/exposure"
       const endpoint = channel.replace("telemetry:", "/telemetry/");
       
       const response = await fetch(`${this.baseUrl}${endpoint}`, {
         method: payload ? "POST" : "GET",
         headers: { "Content-Type": "application/json" },
         body: payload ? JSON.stringify(payload) : undefined
       });
       
       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       return response.json();
     }
   }
   ```

2. **Register the Transport on App Init**:
   In `src/main.tsx` (or your entry point), read the environment variables and swap the transport:
   ```typescript
   import { setTelemetryTransport } from "./services/telemetry";
   import { HttpTelemetryTransport } from "./services/backendTelemetry";

   if (import.meta.env.VITE_USE_MOCK_DATA === "false") {
     const backendTransport = new HttpTelemetryTransport();
     setTelemetryTransport(backendTransport);
   }
   ```

3. **Establish Real-Time Feeds (WebSockets)**:
   For channels that require real-time updates (like new trackers or network connections), establish a WebSocket connection in the background and use a React Context / Custom event bus to push those events directly into the frontend notifications.

---

## 👥 Git Workflow & Collaboration Guidelines

To keep the repository clean and avoid conflict issues, all contributors should follow these conventions:

### 1. Branching Strategy
- **`main`**: The stable branch. Do not commit directly to `main`.
- **`develop`**: The integration branch where finished features are tested together.
- **`feature/*`** or **`bugfix/*`**: Development branches. Create these off of `develop`.
  - Example: `feature/digital-shadow-graph` or `bugfix/sidebar-overlap`.

### 2. Standard Commit Messages
We follow conventional commits to make releases and history self-documenting:
- `feat: <description>` — A new feature.
- `fix: <description>` — A bug fix.
- `docs: <description>` — Documentation-only changes.
- `style: <description>` — Markup, white-space, formatting, missing semi-colons (no code changes).
- `refactor: <description>` — A code change that neither fixes a bug nor adds a feature.
- `test: <description>` — Adding missing tests or correcting existing tests.

### 3. Submission Protocol
1. Pull the latest updates from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Rebase or merge `develop` into your feature branch to resolve any conflicts locally.
3. Validate your code before pushing:
   - Run type-checks: `npm run typecheck`
   - Run a test build: `npm run build`
4. Push your feature branch and create a **Pull Request (PR)** targeting the `develop` branch.
5. Get at least one peer approval before merging.
