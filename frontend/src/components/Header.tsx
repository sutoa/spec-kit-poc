import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div>
        {/* Icons for notifications, help, and user avatar will go here */}
        <span>Notifications</span>
        <span>Help</span>
        <span>Avatar</span>
      </div>
    </header>
  );
};

export default Header;