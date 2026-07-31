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
  const { logout } = useAuth();
  
  const navItems = [
    { label: 'Symptom Checker', icon: <Activity size={20} />, path: '/app/symptoms' },
    { label: 'Report Analysis', icon: <FileText size={20} />, path: '/app/reports' },
    { label: 'X-ray Analysis', icon: <ScanHeart size={20} />, path: '/app/xray' },
    { label: 'Cost Estimation', icon: <Calculator size={20} />, path: '/app/cost-estimator' },
    { label: 'Doctors', icon: <Users size={20} />, path: '/app/doctors' },
  ];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* The user requested to keep Settings and Logout in the top navbar, 
          so we don't necessarily need them here, but the image shows them. 
          The user prompt says: "keep the settings and log out button as it is how it is now and dont change their positions" 
          This means we will leave them in the Navbar and not put them in the Sidebar. 
          We'll keep the sidebar clean. */}
    </aside>
  );
}
