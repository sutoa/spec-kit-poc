import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NotificationProvider, useNotification } from './NotificationContext';
import { Notification } from '../components/Notification';
import { vi } from 'vitest';

vi.useFakeTimers();

describe('NotificationProvider and Notification Component', () => {
  const TestComponent = () => {
    const { showNotification } = useNotification();
    return (
      <div>
        <button onClick={() => showNotification('Success message', 'success')}>Show Success</button>
        <button onClick={() => showNotification('Error message', 'error')}>Show Error</button>
      </div>
    );
  };

  it('renders NotificationProvider and displays notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Success message').closest('div')).toHaveClass('bg-green-500');
  });

  it('closes notification after timeout', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));
    expect(screen.getByText('Error message')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
  });

  it('closes notification when close button is clicked', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('X'));
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });
});
