import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { getDashboardData } from '../services/api';
import { vi, Mock as ViMock } from 'vitest';
import { NotificationProvider } from '../context/NotificationContext'; // Import NotificationProvider

vi.mock('../services/api', () => ({
  getDashboardData: vi.fn(),
}));

// Mock child components to isolate DashboardPage's rendering logic
vi.mock('../components/ReportTable', () => ({
  default: vi.fn(() => <div>Mock ReportTable</div>),
}));
vi.mock('../components/StatCard', () => ({
  default: vi.fn(({ title, value }) => <div>{title}: {value}</div>),
}));
vi.mock('../components/DashboardFilterPanel', () => ({
  default: vi.fn(() => <div>Mock DashboardFilterPanel</div>),
}));
vi.mock('../components/SkeletonLoader', () => ({
  default: vi.fn(() => <div>Mock SkeletonLoader</div>),
}));


const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <NotificationProvider>
            {ui}
        </NotificationProvider>
    );
};

describe('DashboardPage', () => {
  it('renders "Consolidated Account Report" heading in the Header', async () => {
    (getDashboardData as ViMock).mockResolvedValueOnce({ grand_total: 0, institutions: [] });
    renderWithProviders(<DashboardPage />);
    // The main heading is now in the Header component, which is part of the Layout.
    // DashboardPage itself does not render this heading anymore.
    // We expect the DashboardPage to render its content eventually.
    expect(await screen.findByText(/mock dashboardfilterpanel/i)).toBeInTheDocument();
  });

  it('displays loading state using SkeletonLoader initially', () => {
    (getDashboardData as ViMock).mockReturnValueOnce(new Promise(() => {})); // Never resolves
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Mock SkeletonLoader')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    (getDashboardData as ViMock).mockRejectedValueOnce(new Error('Failed to fetch'));
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText(/error: failed to fetch/i)).toBeInTheDocument();
  });

  it('displays no connected institutions message if no data', async () => {
    (getDashboardData as ViMock).mockResolvedValueOnce({ grand_total: 0, institutions: [] });
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText(/no connected institutions found/i)).toBeInTheDocument();
  });

  it('displays dashboard data after successful fetch', async () => {
    const mockDashboardData = {
      grand_total: 1000.50,
      institutions: [
        {
          id: 1,
          external_id: 'inst1',
          name: 'Bank A',
          status: 'connected',
          accounts: [{ id:1, external_id: 'acc1', masked_account_number: '1234', balance: 1000.50, as_of_date: '2023-01-01', institution_id: 1 }],
          sub_total: 1000.50,
        },
      ],
    };
    (getDashboardData as ViMock).mockResolvedValueOnce(mockDashboardData);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Grand Total: $1000.50')).toBeInTheDocument();
    expect(screen.getByText('Total Institutions: 1')).toBeInTheDocument();
    expect(screen.getByText('Mock ReportTable')).toBeInTheDocument();
    expect(screen.getByText('Mock DashboardFilterPanel')).toBeInTheDocument();
  });
});
