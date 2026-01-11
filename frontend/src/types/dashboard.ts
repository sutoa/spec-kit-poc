// frontend/src/types/dashboard.ts

export interface Account {
  id: number;
  external_id: string;
  masked_account_number: string;
  balance: number;
  as_of_date: string; // Using string for date (YYYY-MM-DD) for simplicity
  institution_id: number;
}

export interface InstitutionGroup {
  institution: {
    id: number;
    name: string;
    // Add other institution fields if needed for display within the group
  };
  accounts: Account[];
  sub_total: number;
}

export interface DashboardReport {
  institution_groups: InstitutionGroup[];
  grand_total: number;
}