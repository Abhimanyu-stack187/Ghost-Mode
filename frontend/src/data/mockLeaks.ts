export type BreachSeverity = "low" | "medium" | "high" | "critical";

export interface BreachRecord {
  id: string;
  service: string;
  date: string;
  year: string;
  severity: BreachSeverity;
  summary: string;
  exposedData: string[];
  impactScore: number;
  accent: string;
}

export interface LeakExposure {
  email: string;
  status: "exposed" | "clear";
  impactScore: number;
  breaches: BreachRecord[];
}

export const mockLeakExposure: LeakExposure = {
  email: "user@example.com",
  status: "exposed",
  impactScore: 78,
  breaches: [
    {
      id: "breach-linkedin",
      service: "LinkedIn",
      date: "June 2016",
      year: "2016",
      severity: "critical",
      summary: "Account credentials appeared in a large-scale professional network breach.",
      exposedData: ["Email address", "Password hash", "Professional profile"],
      impactScore: 92,
      accent: "#35e9ff",
    },
    {
      id: "breach-dropbox",
      service: "Dropbox",
      date: "August 2016",
      year: "2016",
      severity: "high",
      summary: "Authentication data associated with this address was exposed.",
      exposedData: ["Email address", "Password hash"],
      impactScore: 76,
      accent: "#4586ff",
    },
    {
      id: "breach-canva",
      service: "Canva",
      date: "May 2019",
      year: "2019",
      severity: "high",
      summary: "Design platform account data was included in a compromised dataset.",
      exposedData: ["Email address", "Name", "Username", "Password hash"],
      impactScore: 84,
      accent: "#9b5cff",
    },
  ],
};
