import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DigitalShadowPage } from "../pages/DigitalShadowPage";
import { ExposureMapPage } from "../pages/ExposureMapPage";
import { LeaksPage } from "../pages/LeaksPage";
import { OverviewPage } from "../pages/OverviewPage";
import { PermissionsPage } from "../pages/PermissionsPage";
import { PrivacyReplayPage } from "../pages/PrivacyReplayPage";
import { SettingsPage } from "../pages/SettingsPage";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/digital-shadow" element={<DigitalShadowPage />} />
        <Route path="/privacy-replay" element={<PrivacyReplayPage />} />
        <Route path="/exposure-map" element={<ExposureMapPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        <Route path="/leaks" element={<LeaksPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
