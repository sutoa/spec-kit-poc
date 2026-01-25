interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="bg-panel-dark text-text-primary-dark p-4 flex items-center justify-between border-b border-border-dark">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        {/* Icons and avatar can go here */}
        <span className="material-symbols-outlined text-text-secondary-dark cursor-pointer">settings</span>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">JS</div>
      </div>
    </header>
  );
}

export default Header;
