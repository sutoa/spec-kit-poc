import { render, screen } from '@testing-library/react';
import Header from '../../../src/components/layout/Header';

describe('Header', () => {
  it('renders Header component', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
