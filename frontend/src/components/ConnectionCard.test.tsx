import { render, screen, fireEvent } from '@testing-library/react';
import ConnectionCard from './ConnectionCard';
import { vi } from 'vitest';
import '@testing-library/jest-dom'; // Import for toBeInTheDocument

// Mock the API service as it's not relevant for unit testing the component's rendering
vi.mock('../services/api', () => ({
  connectInstitution: vi.fn(),
}));

describe('ConnectionCard', () => {
  const mockInstitutionConnected = {
    id: 1,
    external_id: 'ext-1',
    name: 'Fidelity',
    status: 'connected' as 'connected',
    logoUrl: 'https://example.com/fidelity.png',
  };

  const mockInstitutionDisconnected = {
    id: 2,
    external_id: 'ext-2',
    name: 'Vanguard',
    status: 'disconnected' as 'disconnected',
    logoUrl: 'https://example.com/vanguard.png',
  };

  const mockInstitutionError = {
    id: 3,
    external_id: 'ext-3',
    name: 'Bank of America',
    status: 'error' as 'error',
    logoUrl: 'https://example.com/boa.png',
  };

  const mockInstitutionPending = {
    id: 4,
    external_id: 'ext-4',
    name: 'Robinhood',
    status: 'pending' as 'pending',
    logoUrl: 'https://example.com/robinhood.png',
  };

  const mockOnConnectClick = vi.fn();

  beforeEach(() => {
    mockOnConnectClick.mockClear(); // Clear mock calls before each test
  });

  it('renders institution name and logo when provided', () => {
    render(<ConnectionCard institution={mockInstitutionConnected} onConnectClick={mockOnConnectClick} />);
    expect(screen.getByText(mockInstitutionConnected.name)).toBeInTheDocument();
    const logo = screen.getByAltText(`${mockInstitutionConnected.name} logo`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', mockInstitutionConnected.logoUrl);
  });

  it('renders status for connected institution', () => {
    render(<ConnectionCard institution={mockInstitutionConnected} onConnectClick={mockOnConnectClick} />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
    const dot = screen.getByTestId('status-dot');
    expect(dot).toHaveClass('bg-green-500');
  });

  it('renders status for disconnected institution and shows Connect button on menu click', () => {
    render(<ConnectionCard institution={mockInstitutionDisconnected} onConnectClick={mockOnConnectClick} />);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    const dot = screen.getByTestId('status-dot');
    expect(dot).toHaveClass('bg-gray-400');

    // Click the more_vert button to open the menu
    fireEvent.click(screen.getByText('more_vert'));
    
    const connectButton = screen.getByRole('button', { name: /Connect/i });
    expect(connectButton).toBeInTheDocument();
    
    fireEvent.click(connectButton);
    expect(mockOnConnectClick).toHaveBeenCalledTimes(1);
    expect(mockOnConnectClick).toHaveBeenCalledWith(mockInstitutionDisconnected.id);
  });

  it('renders status for error institution', () => {
    render(<ConnectionCard institution={mockInstitutionError} onConnectClick={mockOnConnectClick} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    const dot = screen.getByTestId('status-dot');
    expect(dot).toHaveClass('bg-red-500');
    // Ensure "Connect" button is not present if menu is open but status is error (as per current logic)
    fireEvent.click(screen.getByText('more_vert'));
    expect(screen.queryByRole('button', { name: /Connect/i })).not.toBeInTheDocument();
  });

  it('renders status for pending institution', () => {
    render(<ConnectionCard institution={mockInstitutionPending} onConnectClick={mockOnConnectClick} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    const dot = screen.getByTestId('status-dot');
    expect(dot).toHaveClass('bg-yellow-500');
    // Ensure "Connect" button is not present if menu is open but status is pending
    fireEvent.click(screen.getByText('more_vert'));
    expect(screen.queryByRole('button', { name: /Connect/i })).not.toBeInTheDocument();
  });

  it('closes the menu when connect button is clicked', () => {
    render(<ConnectionCard institution={mockInstitutionDisconnected} onConnectClick={mockOnConnectClick} />);
    fireEvent.click(screen.getByText('more_vert')); // Open menu
    expect(screen.getByRole('button', { name: /Connect/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Connect/i })); // Click connect
    expect(screen.queryByRole('button', { name: /Connect/i })).not.toBeInTheDocument(); // Menu should be closed
  });

  it('closes the menu when clicking outside', () => {
    render(<ConnectionCard institution={mockInstitutionDisconnected} onConnectClick={mockOnConnectClick} />);
    fireEvent.click(screen.getByText('more_vert')); // Open menu
    expect(screen.getByRole('button', { name: /Connect/i })).toBeInTheDocument();
    fireEvent.mouseDown(document.body); // Simulate click outside
    expect(screen.queryByRole('button', { name: /Connect/i })).not.toBeInTheDocument(); // Menu should be closed
  });

});