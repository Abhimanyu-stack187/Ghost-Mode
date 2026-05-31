import {
  Activity,
  Eye,
  GitFork,
  KeyRound,
  RadioTower,
  RotateCcw,
  Settings2,
} from "lucide-react";

export const primaryNavigation = [
  { label: "Overview", to: "/", icon: Activity },
  { label: "Digital Shadow", to: "/digital-shadow", icon: GitFork },
  { label: "Privacy Replay", to: "/privacy-replay", icon: RotateCcw },
  { label: "Exposure Map", to: "/exposure-map", icon: RadioTower },
  { label: "Permissions", to: "/permissions", icon: Eye },
  { label: "Leaks", to: "/leaks", icon: KeyRound },
];

export const secondaryNavigation = [
  { label: "Settings", to: "/settings", icon: Settings2 },
];
