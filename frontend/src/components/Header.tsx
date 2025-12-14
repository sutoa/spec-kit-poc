import React from 'react';
import { Link } from 'react-router-dom'; // Assuming Link is used for navigation or can be removed if not needed

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-panel-light dark:bg-panel-dark flex-shrink-0 h-16">
      <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark">{title}</h2>
      <div className="flex flex-1 justify-end gap-4 items-center">
        {/* These buttons are specific to the Connections page, so they should ideally be in that page's Header.
            For now, placing them here as per mockup and will make them conditional later if needed. */}
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User avatar image" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMYwGHah-qvsDx9c2AhpUxDCo7K7AK4ThTzCzIW9mZbh6F1VdHPvhYBzHV4Xo1MQ2qv8GCFaHeRXEVoHs6IvQk5EAnCSLPt-TUtslMHGaW7Gjj8ErLf0rCqAoplvIU9nA324f6eC9EeHnD0SKJC0lLjuMl8qXHpjAU7QVTPoVgUiXE3kiy4eeHS0FmZVzhsF5K_cMo5RvxE_bf7D0fphopbYcGMEpo4Nsy0E9Lt-vRA__4JZyeHrdRD7X0jmyt_oltAwSUi7upXQH7");'></div>
      </div>
    </header>
  );
};

export default Header;