import { render, screen } from '@testing-library/react';
import ConnectionCard from './ConnectionCard';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { Institution } from '../types/connection';

// Mock the SnapTradeLink component
vi.mock('../snaptrade-sdk', () => ({
  SnapTradeLink: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SnapTradeSuccessData: vi.fn(),
  SnapTradeError: vi.fn(),
}));

describe('ConnectionCard', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  const mockOnClose = vi.fn();

  const baseInstitution: Omit<Institution, 'status'> = {
    id: 1,
    external_id: 'ext-1',
    name: 'Fidelity',
  };

  it('renders correctly for a "connected" institution', () => {
    const institution: Institution = { ...baseInstitution, status: 'connected' };
    render(
      <ConnectionCard
        institution={institution}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Fidelity')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connected' })).toBeDisabled();
  });

  it('renders correctly for a "disconnected" institution', () => {
    const institution: Institution = { ...baseInstitution, status: 'disconnected' };
    render(
      <ConnectionCard
        institution={institution}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Fidelity')).toBeInTheDocument();
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeEnabled();
  });

  it('renders correctly for an "error" institution', () => {
    const institution: Institution = { ...baseInstitution, status: 'error' };
    render(
      <ConnectionCard
        institution={institution}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Fidelity')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeEnabled();
  });

  it('renders correctly for a "pending" institution', () => {
    const institution: Institution = { ...baseInstitution, status: 'pending' };
    render(
      <ConnectionCard
        institution={institution}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Fidelity')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeEnabled();
  });
});
