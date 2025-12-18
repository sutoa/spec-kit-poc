import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConnectionsPage from './ConnectionsPage';
import { getInstitutions } from '../services/api';
import { vi, Mock as ViMock } from 'vitest';

vi.mock('../services/api', () => ({
  getInstitutions: vi.fn(),
}));

describe('ConnectionsPage', () => {
  it('renders "Manage Financial Institutions" heading', async () => {
    (getInstitutions as ViMock).mockResolvedValueOnce([]);
    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /manage financial institutions/i })).toBeInTheDocument();
  });

  it('displays institutions fetched from the API', async () => {
    const mockInstitutions = [
      { id: 1, external_id: 'inst1', name: 'Bank A', status: 'connected' }, // id changed to number
      { id: 2, external_id: 'inst2', name: 'Bank B', status: 'disconnected' }, // id changed to number
    ];
    (getInstitutions as ViMock).mockResolvedValueOnce(mockInstitutions);

    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );

    expect(await screen.findByText('Bank A')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument(); // Updated for casing
    expect(screen.getByText('Bank B')).toBeInTheDocument();
    expect(screen.getByText('Disconnected')).toBeInTheDocument(); // Updated for casing
  });
});
