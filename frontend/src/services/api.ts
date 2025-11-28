const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// TypeScript Interfaces based on OpenAPI schema
export interface Account {
  name: string;
  mask: string;
  balance: number;
  balance_as_of: string; // YYYY-MM-DD
}

export interface InstitutionReport {
  institution_name: string;
  accounts: Account[];
  sub_total: number;
  status: 'succeeded' | 'failed';
  error_message?: string;
}

export interface Report {
  institutions: InstitutionReport[];
  grand_total: number;
}

export const createLinkToken = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/plaid/create_link_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to create link token');
  }
  const data = await response.json();
  return data.link_token;
};

export const exchangePublicToken = async (publicToken: string): Promise<{ item_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/plaid/exchange_public_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ public_token: publicToken }),
  });
  if (!response.ok) {
    throw new Error('Failed to exchange public token');
  }
  const data = await response.json();
  return data;
};
