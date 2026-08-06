import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  FileText, 
  Settings, 
  LogOut,
  Users,
  ScanHeart,
  Calculator
} from 'lucide-react';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openLogoutModal } = useAuth();
  
  const navItems = [
    { label: 'Symptom Checker', icon: <Activity size={20} />, path: '/app/symptoms' },
    { label: 'Report Analysis', icon: <FileText size={20} />, path: '/app/reports' },
    { label: 'X-ray Analysis', icon: <ScanHeart size={20} />, path: '/app/xray' },
    { label: 'Cost Estimation', icon: <Calculator size={20} />, path: '/app/cost-estimator' },
    { label: 'Doctors', icon: <Users size={20} />, path: '/app/doctors' },
  ];

  const handleLogout = () => {
    openLogoutModal();
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top-section">
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/app/symptoms' && (location.pathname === '/app' || location.pathname === '/app/'));
            return (
              <Link 
                key={item.label} 
                to={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom-section">
        <hr className="sidebar-divider" />
        <Link 
          to="/app/settings" 
          className={`sidebar-link ${location.pathname === '/app/settings' ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button 
          type="button" 
          className="sidebar-link sidebar-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
