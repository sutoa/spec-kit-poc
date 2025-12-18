import { render, screen } from '@testing-library/react';
import ConnectionCard from './ConnectionCard';
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  connectInstitution: vi.fn(),
}));

describe('ConnectionCard', () => {
  const mockInstitution = {
    id: 123,
    external_id: 'test-ext-id-123',
    name: 'Test Bank',
    status: 'disconnected' as 'disconnected', // Explicitly set status to one of the literal types
  };

  it('renders institution name and status', () => {
    render(<ConnectionCard institution={mockInstitution} />);
    expect(screen.getByText('Test Bank')).toBeInTheDocument();
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('does not display a Connect button', () => {
    render(<ConnectionCard institution={mockInstitution} />);
    expect(screen.queryByRole('button', { name: /connect/i })).not.toBeInTheDocument();
  });

  it('does not display a Connect button if status is connected', () => {
    render(<ConnectionCard institution={{ ...mockInstitution, status: 'connected' }} />);
    expect(screen.queryByRole('button', { name: /connect/i })).not.toBeInTheDocument();
  });

});
