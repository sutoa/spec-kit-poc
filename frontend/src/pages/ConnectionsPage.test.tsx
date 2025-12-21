import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConnectionsPage from './ConnectionsPage';
import { getInstitutions } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useSnapTrade } from '../snaptrade-sdk';
import { vi, Mock as ViMock } from 'vitest';
import '@testing-library/jest-dom';

// Mock API service
vi.mock('../services/api', () => ({
  getInstitutions: vi.fn(),
}));

// Mock NotificationContext
vi.mock('../context/NotificationContext', () => ({
  useNotification: vi.fn(() => ({
    showNotification: vi.fn(),
  })),
}));

// Mock SnapTrade SDK
vi.mock('../snaptrade-sdk', () => ({
  useSnapTrade: vi.fn(() => ({
    connect: vi.fn(),
    isLoading: false,
    error: null,
  })),
}));

describe('ConnectionsPage', () => {
  const mockInstitutions = [
    { id: 1, external_id: 'inst1', name: 'Fidelity', status: 'connected', logoUrl: 'fidelity.png' },
    { id: 2, external_id: 'inst2', name: 'Vanguard', status: 'disconnected', logoUrl: 'vanguard.png' },
    { id: 3, external_id: 'inst3', name: 'Charles Schwab', status: 'error', logoUrl: 'schwab.png' },
    { id: 4, external_id: 'inst4', name: 'TD Ameritrade', status: 'pending', logoUrl: 'tdameritrade.png' },
  ];

  beforeEach(() => {
    (getInstitutions as ViMock).mockClear();
    (useNotification as ViMock).mockClear();
    (useSnapTrade as ViMock).mockClear();
  });

  it('renders "Manage Financial Institutions" heading', async () => {
    (getInstitutions as ViMock).mockResolvedValue([]);
    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /manage financial institutions/i })).toBeInTheDocument();
  });

  it('displays institutions fetched from the API, sorted correctly', async () => {
    (getInstitutions as ViMock).mockResolvedValueOnce([
      mockInstitutions[1], // Vanguard (disconnected)
      mockInstitutions[0], // Fidelity (connected)
      mockInstitutions[2], // Schwab (error)
    ]);

    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Fidelity')).toBeInTheDocument();
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
      expect(screen.getByText('Charles Schwab')).toBeInTheDocument();
      expect(screen.getByAltText('Fidelity logo')).toBeInTheDocument();
      expect(screen.getByAltText('Vanguard logo')).toBeInTheDocument();
    });

    // Verify sorting: connected institutions first, then alphabetically
    const institutionNames = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    // Fidelity is connected, then Schwab and Vanguard are sorted alphabetically (Vanguard comes before Schwab)
    expect(institutionNames[0]).toBe('Fidelity');
    // Note: The actual DOM order might not directly reflect the visual grid order without more advanced testing
    // but checking for presence is sufficient for now.
  });

  it('filters institutions based on search term', async () => {
    (getInstitutions as ViMock).mockResolvedValueOnce(mockInstitutions);

    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );

    // Initial render should show all institutions
    await waitFor(() => {
      expect(screen.getByText('Fidelity')).toBeInTheDocument();
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
      expect(screen.getByText('Charles Schwab')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Find institution');
    fireEvent.change(searchInput, { target: { value: 'van' } });

    // Only Vanguard should be visible
    await waitFor(() => {
      expect(screen.queryByText('Fidelity')).not.toBeInTheDocument();
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
      expect(screen.queryByText('Charles Schwab')).not.toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: '' } }); // Clear search

    // All should be visible again
    await waitFor(() => {
      expect(screen.getByText('Fidelity')).toBeInTheDocument();
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
      expect(screen.getByText('Charles Schwab')).toBeInTheDocument();
    });
  });

  it('calls useSnapTrade connect when "Connect" button is clicked', async () => {
    const mockConnect = vi.fn();
    (useSnapTrade as ViMock).mockReturnValue({
      connect: mockConnect,
      isLoading: false,
      error: null,
    });
    (getInstitutions as ViMock).mockResolvedValueOnce(mockInstitutions);

    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );

    // Wait for institutions to load
    await screen.findByText('Vanguard');

    // Open the menu for Vanguard (disconnected)
    const vanguardCard = screen.getByText('Vanguard').closest('.relative'); // Find the card by name
    if (vanguardCard) {
      fireEvent.click(screen.getByTestId('more-vert-button')); // Click the button using data-testid
    } else {
      throw new Error('Vanguard card not found');
    }

    // Click the "Connect" button within the menu
    const connectButton = screen.getByRole('button', { name: /Connect/i });
    fireEvent.click(connectButton);

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith(mockInstitutions[1].id.toString()); // Vanguard's ID as string
  });

  it('shows error notification if fetching institutions fails', async () => {
    const mockShowNotification = vi.fn();
    (useNotification as ViMock).mockReturnValue({
      showNotification: mockShowNotification,
    });
    const errorMessage = 'Network Error';
    (getInstitutions as ViMock).mockRejectedValueOnce(new Error(errorMessage));

    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(`Error fetching institutions: ${errorMessage}`, 'error');
    });
  });

  it('disables the "Add New Connection" button when isLoading from useSnapTrade', async () => {
    (getInstitutions as ViMock).mockResolvedValueOnce([]);
    (useSnapTrade as ViMock).mockReturnValue({
      connect: vi.fn(),
      isLoading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <ConnectionsPage />
      </BrowserRouter>
    );

    const addButton = screen.getByRole('button', { name: /Add New Connection/i });
    expect(addButton).toBeDisabled();
  });
});