import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportTable from './ReportTable';
import { vi } from 'vitest';

describe('ReportTable', () => {
  const mockInstitutions = [
    {
      name: 'Bank A',
      accounts: [
        { masked_account_number: '****1234', balance: 1000.00, as_of_date: '2023-01-01' },
        { masked_account_number: '****5678', balance: 2000.00, as_of_date: '2023-01-01' },
      ],
      sub_total: 3000.00,
    },
    {
      name: 'Bank B',
      accounts: [
        { masked_account_number: '****9012', balance: 1500.00, as_of_date: '2023-01-01' },
      ],
      sub_total: 1500.00,
    },
  ];
  const mockGrandTotal = 4500.00;

  it('renders "Account Report" heading', () => {
    render(<ReportTable institutions={[]} grandTotal={0} />);
    expect(screen.getByRole('heading', { name: /account report/i })).toBeInTheDocument();
  });

  it('renders institution names, subtotals, and account details', () => {
    render(<ReportTable institutions={mockInstitutions} grandTotal={mockGrandTotal} />);

    expect(screen.getByText('Bank A (Subtotal: $3000.00)')).toBeInTheDocument();
    expect(screen.getByText('****1234')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();

    expect(screen.getByText('Bank B (Subtotal: $1500.00)')).toBeInTheDocument();
    expect(screen.getByText('****9012')).toBeInTheDocument();
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
  });

  it('renders the grand total', () => {
    render(<ReportTable institutions={mockInstitutions} grandTotal={mockGrandTotal} />);
    expect(screen.getByRole('heading', { name: /grand total: \$4500.00/i })).toBeInTheDocument();
  });

  it('renders no institutions message if institutions array is empty', () => {
    render(<ReportTable institutions={[]} grandTotal={0} />);
    expect(screen.queryByText(/bank a/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/grand total: \$0.00/i)).toBeInTheDocument();
  });
});
