import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Connections from './pages/Connections';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout title="Home"><p className="text-text-primary-dark">Welcome to Financial Hub</p></Layout>} />
        <Route path="/dashboard" element={<Layout title="Dashboard"><Dashboard /></Layout>} />
        <Route path="/connections" element={<Layout title="Connections"><Connections /></Layout>} />
        <Route path="*" element={<Layout title="Not Found"><p className="text-text-primary-dark">404 - Page Not Found</p></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;