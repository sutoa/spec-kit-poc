import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardFilterPanel from './DashboardFilterPanel';
import { vi } from 'vitest';

describe('DashboardFilterPanel', () => {
  it('renders filter panel elements', () => {
    const mockOnDateChange = vi.fn();
    const mockOnRefresh = vi.fn();
    render(<DashboardFilterPanel onDateChange={mockOnDateChange} onRefresh={mockOnRefresh} />);
    
    expect(screen.getByRole('heading', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/as of date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh data/i })).toBeInTheDocument();
  });

  it('calls onDateChange when date input changes', () => {
    const mockOnDateChange = vi.fn();
    const mockOnRefresh = vi.fn();
    render(<DashboardFilterPanel onDateChange={mockOnDateChange} onRefresh={mockOnRefresh} />);
    
    const dateInput = screen.getByLabelText(/as of date/i);
    fireEvent.change(dateInput, { target: { value: '2023-10-26' } });
    
    expect(mockOnDateChange).toHaveBeenCalledWith('2023-10-26');
  });

  it('calls onRefresh when Refresh Data button is clicked', () => {
    const mockOnDateChange = vi.fn();
    const mockOnRefresh = vi.fn();
    render(<DashboardFilterPanel onDateChange={mockOnDateChange} onRefresh={mockOnRefresh} />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh data/i });
    fireEvent.click(refreshButton);
    
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });
});
