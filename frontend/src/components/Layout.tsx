import React from 'react';
import { SideNav } from './SideNav'; // Assuming SideNav will be created soon
import { Header } from './Header'; // Assuming Header will be created soon

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};