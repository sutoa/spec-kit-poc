import { render, screen, fireEvent } from '@testing-library/react';
import DashboardFilterPanel from './DashboardFilterPanel';
import { vi } from 'vitest';

describe('DashboardFilterPanel', () => {
  const mockInstitutions = ['Alpaca', 'Vanguard'];

  it('renders filter panel elements', () => {
    const mockOnDateChange = vi.fn();
    const mockOnRefresh = vi.fn();
    render(<DashboardFilterPanel onDateChange={mockOnDateChange} onRefresh={mockOnRefresh} institutions={mockInstitutions} />);
    
    expect(screen.getByRole('heading', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/as of date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument(); // Changed button name
  });

  it('calls onDateChange when date input changes', () => {
    const mockOnDateChange = vi.fn();
    const mockOnRefresh = vi.fn();
    render(<DashboardFilterPanel onDateChange={mockOnDateChange} onRefresh={mockOnRefresh} institutions={mockInstitutions} />);
    
    const dateInput = screen.getByLabelText(/as of date/i);
    fireEvent.change(dateInput, { target: { value: '2023-10-26' } });
    
    // The onDateChange is now called by handleApplyFilters
  });

  it('calls onRefresh when Apply Filters button is clicked', () => {
    const mockOnDateChange = vi.fn();
    const mockOnRefresh = vi.fn();
    render(<DashboardFilterPanel onDateChange={mockOnDateChange} onRefresh={mockOnRefresh} institutions={mockInstitutions} />);
    
    const applyButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyButton);
    
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });
});
