import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConnectionsPage from './ConnectionsPage';
import { getInstitutions } from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  getInstitutions: vi.fn(),
}));

describe('ConnectionsPage', () => {
  it('renders "Manage Financial Institutions" heading', async () => {
    (getInstitutions as Mock).mockResolvedValueOnce([]);
    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /manage financial institutions/i })).toBeInTheDocument();
  });

  it('displays institutions fetched from the API', async () => {
    const mockInstitutions = [
      { id: '1', external_id: 'inst1', name: 'Bank A', status: 'connected' },
      { id: '2', external_id: 'inst2', name: 'Bank B', status: 'disconnected' },
    ];
    (getInstitutions as Mock).mockResolvedValueOnce(mockInstitutions);

    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );

    expect(await screen.findByText('Bank A')).toBeInTheDocument();
    expect(screen.getByText('Status: connected')).toBeInTheDocument();
    expect(screen.getByText('Bank B')).toBeInTheDocument();
    expect(screen.getByText('Status: disconnected')).toBeInTheDocument();
  });
});
