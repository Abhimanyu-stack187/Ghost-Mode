import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { TelemetrySimulationProvider } from "./contexts/TelemetrySimulationContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <TelemetrySimulationProvider>
          <App />
        </TelemetrySimulationProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>,
);
