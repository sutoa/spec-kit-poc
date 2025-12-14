import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import SideNav from './SideNav';
import Header from './Header';

// Mock Header and SideNav to simplify Layout testing
vi.mock('./SideNav', () => ({
  default: vi.fn(() => <div>Mock SideNav</div>),
}));
vi.mock('./Header', () => ({
  default: vi.fn(({ title }) => <h1>Mock Header: {title}</h1>),
}));


describe('Layout', () => {
  it('renders SideNav, Header, and children correctly', () => {
    render(
      <BrowserRouter>
        <Layout title="Test Page">
          <div>Test Children Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(SideNav).toHaveBeenCalled();
    expect(Header).toHaveBeenCalledWith({ title: 'Test Page' }, {});
    expect(screen.getByText('Test Children Content')).toBeInTheDocument();
  });
});

describe('SideNav', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <SideNav />
      </BrowserRouter>
    );

    expect(screen.getByText('Account Viewer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /connections/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
  });
});

describe('Header', () => {
  it('renders the provided title', () => {
    render(<Header title="Connections Page" />);
    expect(screen.getByRole('heading', { name: /connections page/i })).toBeInTheDocument();
  });

  it('renders placeholder icons', () => {
    render(<Header title="Dashboard Page" />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Avatar')).toBeInTheDocument();
  });
});
