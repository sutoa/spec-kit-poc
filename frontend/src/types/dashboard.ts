export interface Institution {
  id: number;
  external_id: string;
  name: string;
  status: string;
}

export interface Account {
  id: number;
  external_id: string;
  masked_account_number: string;
  balance: number;
  as_of_date: string; // Using string for date from backend
  institution_id: number;
}

export interface DashboardInstitution {
  institution: Institution;
  accounts: Account[];
  sub_total: number;
}

export interface DashboardResponse {
  grand_total: number;
  institutions: DashboardInstitution[];
}
