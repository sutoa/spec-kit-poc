import React from 'react';
import SideNav from './SideNav';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;