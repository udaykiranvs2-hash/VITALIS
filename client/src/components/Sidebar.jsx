import { Link, useLocation } from 'react-router-dom';
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
  const { openLogoutModal } = useAuth();
  
  const navItems = [
    { label: 'Symptom Checker', icon: <Activity size={20} className="sidebar-icon icon-pulse" />, path: '/app/symptoms' },
    { label: 'Report Analysis', icon: <FileText size={20} className="sidebar-icon icon-doc" />, path: '/app/reports' },
    { label: 'X-ray Analysis', icon: <ScanHeart size={20} className="sidebar-icon icon-scan" />, path: '/app/xray' },
    { label: 'Cost Estimation', icon: <Calculator size={20} className="sidebar-icon icon-calc" />, path: '/app/cost-estimator' },
    { label: 'Doctors', icon: <Users size={20} className="sidebar-icon icon-users" />, path: '/app/doctors' },
  ];

  const handleLogout = () => {
    openLogoutModal();
  };

  return (
    <aside className="app-sidebar">
      {/* Live Animated Background Design Elements */}
      <div className="sidebar-bg-decor" aria-hidden="true">
        <div className="sidebar-particle p-1" />
        <div className="sidebar-particle p-2" />
        <div className="sidebar-particle p-3" />
        <svg className="sidebar-wave-svg" viewBox="0 0 270 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 150 C50 250, 180 100, 270 300 C360 500, 150 700, 320 900" stroke="rgba(255,255,255,0.08)" strokeWidth="36" strokeLinecap="round" className="wave-path-1" />
          <path d="M-20 400 C120 300, 80 600, 290 550" stroke="rgba(255,255,255,0.05)" strokeWidth="22" strokeLinecap="round" className="wave-path-2" />
        </svg>
      </div>

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
                <div className="icon-wrapper">
                  {item.icon}
                </div>
                <span className="sidebar-label">{item.label}</span>
                {isActive && <span className="active-live-dot" />}
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
          <div className="icon-wrapper">
            <Settings size={20} className="sidebar-icon icon-gear" />
          </div>
          <span className="sidebar-label">Settings</span>
          {location.pathname === '/app/settings' && <span className="active-live-dot" />}
        </Link>
        <button 
          type="button" 
          className="sidebar-link sidebar-logout-btn"
          onClick={handleLogout}
        >
          <div className="icon-wrapper">
            <LogOut size={20} className="sidebar-icon icon-logout" />
          </div>
          <span className="sidebar-label">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
