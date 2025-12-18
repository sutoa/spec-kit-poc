export interface Account {
  id?: number;
  external_id: string;
  masked_account_number: string;
  balance: number;
  as_of_date: string; // YYYY-MM-DD format
  institution_id: number;
}

export interface Institution {
  id: number;
  external_id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  accounts?: Account[];
  sub_total?: number;
}