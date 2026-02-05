
export interface InsightData {
  summary: string;
  themes: string[];
  toneSignal: string;
  reflectionPrompts: string[];
  riskNote?: string | null;
}

export interface User {
  username: string;
  role: string;
  lastLogin: number;
}

export interface SessionRecord {
  id: string;
  timestamp: number;
  reflection: string;
  insight: InsightData;
}

export enum AppStatus {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  KEY_REQUIRED = 'KEY_REQUIRED'
}

export interface AppState {
  status: AppStatus;
  user: User | null;
  input: string;
  result: InsightData | null;
  error: string | null;
  history: SessionRecord[];
}
