import { render, screen } from '@testing-library/react';
import ReportTable from './ReportTable';

describe('ReportTable', () => {
  const mockInstitutions = [
    {
      name: 'Alpaca',
      accounts: [
        { masked_account_number: '5678', balance: 730123.45, as_of_date: '2023-12-12' },
        { masked_account_number: '1106', balance: 120110.66, as_of_date: '2023-12-12' },
      ],
      sub_total: 850234.11,
    },
    {
      name: 'Vanguard',
      accounts: [
        { masked_account_number: '1122', balance: 25416.64, as_of_date: '2023-12-11' },
        { masked_account_number: '3344', balance: 384100.01, as_of_date: '2023-12-12' },
      ],
      sub_total: 409516.65,
    },
  ];

  it('renders institution names, subtotals, and account details', () => {
    render(<ReportTable institutions={mockInstitutions} grandTotal={0} />); // grandTotal is not used in rendering anymore

    // Check for Alpaca
    expect(screen.getByRole('heading', { name: /alpaca/i })).toBeInTheDocument();
    expect(screen.getByText(/\$850,234\.11/i)).toBeInTheDocument();
    expect(screen.getByText(/•••• 5678/i)).toBeInTheDocument();
    expect(screen.getByText(/\$730,123\.45/i)).toBeInTheDocument();
    expect(screen.getByText(/as of 12\/12\/2023/i)).toBeInTheDocument();

    // Check for Vanguard
    expect(screen.getByRole('heading', { name: /vanguard/i })).toBeInTheDocument();
    expect(screen.getByText(/\$409,516\.65/i)).toBeInTheDocument();
    expect(screen.getByText(/•••• 1122/i)).toBeInTheDocument();
    expect(screen.getByText(/\$25,416\.64/i)).toBeInTheDocument();
    expect(screen.getByText(/as of 12\/11\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/•••• 3344/i)).toBeInTheDocument();
    expect(screen.getByText(/\$384,100\.01/i)).toBeInTheDocument();
  });

  it('renders no institution data when institutions array is empty', () => {
    render(<ReportTable institutions={[]} grandTotal={0} />);
    expect(screen.queryByRole('heading', { name: /alpaca/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /vanguard/i })).not.toBeInTheDocument();
  });
});
