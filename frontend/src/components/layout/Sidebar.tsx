import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="w-64 bg-panel-dark text-text-secondary-dark h-full flex flex-col">
      <div className="p-4 text-white text-xl font-bold border-b border-border-dark">
        Financial Hub
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className="flex items-center p-2 rounded-lg hover:bg-input-bg-dark">
          <span className="material-symbols-outlined mr-2">dashboard</span>
          Dashboard
        </Link>
        <Link to="/connections" className="flex items-center p-2 rounded-lg hover:bg-input-bg-dark">
          <span className="material-symbols-outlined mr-2">link</span>
          Connections
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
