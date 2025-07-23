export interface SecurityCheck {
  id: string;
  name: string;
  status: "checking" | "passed" | "warning" | "failed";
  message: string;
  details?: string;
}

export type ViewState = "results" | "details" | "education";

export type OverallStatus = "safe" | "caution" | "danger" | null;

export interface StatusDisplayConfig {
  gradient: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  glowColor: string;
  title: string;
  subtitle: string;
  message: string;
  riskLevel: string;
  tips: string[];
  icon: React.ReactNode;
}