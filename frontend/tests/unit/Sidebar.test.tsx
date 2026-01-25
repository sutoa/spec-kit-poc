import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../../../src/components/layout/Sidebar';

describe('Sidebar', () => {
  it('renders Sidebar component', () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(screen.getByText('Financial Hub')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Connections')).toBeInTheDocument();
  });
});
