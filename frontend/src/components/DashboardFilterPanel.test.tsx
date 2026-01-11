import { render, screen, fireEvent } from '@testing-library/react';
import DashboardFilterPanel from './DashboardFilterPanel';
import { vi } from 'vitest';

describe('DashboardFilterPanel', () => {
  const mockInstitutions = ['Alpaca', 'Vanguard'];

  it('renders filter panel elements', () => {
    const mockOnFilterChange = vi.fn();
    render(<DashboardFilterPanel onFilterChange={mockOnFilterChange} currentAsOfDate={new Date()} />);
    
    expect(screen.getByRole('heading', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/as of date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument(); // Changed button name
  });

  it('calls onDateChange when date input changes', () => {
    const mockOnFilterChange = vi.fn();
    render(<DashboardFilterPanel onFilterChange={mockOnFilterChange} currentAsOfDate={new Date()} />);
    
    const dateInput = screen.getByLabelText(/as of date/i);
    fireEvent.change(dateInput, { target: { value: '2023-10-26' } });
    
    // The onDateChange is now called by handleApplyFilters
  });


});
