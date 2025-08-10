export interface SecurityCheck {
  id: string;
  name: string;
  status: 'checking' | 'passed' | 'warning' | 'failed';
  message: string;
  details?: string;
}

export interface ScanResult {
  timestamp: number;
  url: string;
  title: string;
  overallStatus: 'safe' | 'caution' | 'danger';
  checks: SecurityCheck[];
}

export interface ExtensionMessage {
  type: string;
  data?: any;
}

export interface ScanResponse {
  success: boolean;
  status?: string;
  checks?: SecurityCheck[];
  error?: string;
  result?: {
    overallStatus: 'safe' | 'caution' | 'danger';
    checks: SecurityCheck[];
    scanResult: ScanResult;
  };
}