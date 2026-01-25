// Enums
export type InstitutionApiType = "api" | "manual";
export type InstitutionAuthType = "api_key" | "oauth" | "credentials" | "none";
export type ConnectionStatus = "connected" | "disconnected" | "error";

// Entities
export interface Institution {
  id: string;
  name: string;
  logoUrl: string | null;
  apiType: InstitutionApiType;
  apiBaseUrl: string | null;
  authType: InstitutionAuthType;
}

export interface Connection {
  id: number;
  institutionId: string;
  status: ConnectionStatus;
  lastSyncAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credential {
  id: number;
  connectionId: number;
  encryptedData: Buffer;
  iv: Buffer;
  authTag: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: number;
  connectionId: number;
  externalId: string;
  accountNumberMasked: string;
  accountName: string;
  accountType: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceRecord {
  id: number;
  accountId: number;
  totalValue: number;
  cashBalance: number | null;
  portfolioValue: number | null;
  asOfDate: Date;
  fetchedAt: Date;
}

// API Response Types
export interface InstitutionWithConnection extends Institution {
  connection: Connection | null;
  lastUpdatedRelative: string | null;  // "2m ago", "15m ago", etc.
}

export interface AccountWithBalance extends Account {
  latestBalance: BalanceRecord | null;
  institution: Pick<Institution, "id" | "name">;
}

export interface AccountWithBalanceHistory extends AccountWithBalance {
  balanceHistory: BalanceRecord[];
}

export interface Brokerage {
  id: string;
  name: string;
  slug: string;
  isConnected: boolean;
}

export interface DashboardReport {
  asOfDate: Date | null;  // Filter date or null for latest
  grandTotal: number;
  totalInstitutions: number;
  institutions: InstitutionSummary[];
}

export interface InstitutionSummary {
  institutionId: string;
  institutionName: string;
  subTotal: number;
  accounts: AccountBalance[];
}

export interface AccountBalance {
  accountId: number;
  accountName: string;
  accountNumberMasked: string;
  totalValue: number;
  asOfDate: Date;
}
