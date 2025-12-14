import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { getDashboardData } from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  getDashboardData: vi.fn(),
}));

describe('DashboardPage', () => {
  it('renders "Consolidated Account Report" heading', async () => {
    (getDashboardData as Mock).mockResolvedValueOnce({ grand_total: 0, institutions: [] });
    render(<DashboardPage />);
    expect(await screen.findByRole('heading', { name: /consolidated account report/i })).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    (getDashboardData as Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolves
    render(<DashboardPage />);
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    (getDashboardData as Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<DashboardPage />);
    expect(await screen.findByText(/error: failed to fetch/i)).toBeInTheDocument();
  });

  it('displays dashboard data after successful fetch', async () => {
    const mockDashboardData = {
      grand_total: 1000,
      institutions: [
        {
          id: 1,
          external_id: 'inst1',
          name: 'Bank A',
          status: 'connected',
          accounts: [{ external_id: 'acc1', masked_account_number: '****1234', balance: 1000, as_of_date: '2023-01-01', institution_id: 1 }],
          sub_total: 1000,
        },
      ],
    };
    (getDashboardData as Mock).mockResolvedValueOnce(mockDashboardData);

    render(<DashboardPage />);

    expect(await screen.findByText('Grand Total: $1000.00')).toBeInTheDocument();
    expect(screen.getByText('Bank A (Subtotal: $1000.00)')).toBeInTheDocument();
    expect(screen.getByText('****1234')).toBeInTheDocument();
  });
});
