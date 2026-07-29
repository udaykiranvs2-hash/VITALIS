import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboard } from '../context/DashboardContext.jsx';
import { Menu, X, HeartPulse, Bell, ChevronDown, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, openLoginModal } = useAuth();
  const { showDashboard, toggleDashboard, closeDashboard } = useDashboard();

  // Scroll effect
  useState(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Features', 'Doctors', 'Pricing', 'About', 'Contact'];

  const handleLogout = () => {
    setIsOpen(false);
    setShowDropdown(false);
    closeDashboard();
    logout();
    navigate('/');
  };

  const handleDashboardToggle = () => {
    if (showDashboard) {
      // Toggle OFF: close sidebar and go to welcome home
      closeDashboard();
      navigate('/app');
    } else {
      // Toggle ON: open sidebar layout; navigate to /app to show dashboard home (6-card grid)
      toggleDashboard();
      navigate('/app');
    }
  };

  const displayName = user?.profile?.fullName || user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className={`app-navbar ${scrolled ? 'scrolled' : 'top'}`}>
      <div className="app-navbar-container">
        <div className="app-navbar-row">
          {/* Logo */}
          <button
            type="button"
            className="app-navbar-logo"
            onClick={() => {
              closeDashboard();
              navigate(user ? '/app' : '/');
            }}
          >
            <div className="app-navbar-logo-mark"><HeartPulse size={22} /></div>
            <div className="app-navbar-logo-text">
              <p>VITALIS</p>
              <span>AI Health Navigator</span>
            </div>
          </button>

          {/* Desktop nav links (unauthenticated only) */}
          {!user && (
            <nav className="app-navbar-links">
              {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div className="app-navbar-actions">
            {user ? (
              <div className="app-navbar-user-section">
                {/* Notification bell */}
                <button type="button" className="app-navbar-bell" aria-label="Notifications">
                  <Bell size={20} />
                  <span className="app-navbar-bell-badge">3</span>
                </button>

                {/* Dashboard toggle */}
                <button
                  type="button"
                  id="navbar-dashboard-toggle"
                  className={`app-navbar-dashboard-btn ${showDashboard ? 'active' : ''}`}
                  onClick={handleDashboardToggle}
                  aria-label="Toggle Dashboard"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </button>

                {/* Profile dropdown */}
                <div className="app-navbar-user-dropdown-container">
                  <button
                    type="button"
                    className="app-navbar-user-profile-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <img
                      src="/user-avatar.png"
                      alt={displayName}
                      className="app-navbar-avatar"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="app-navbar-user-name">{displayName}</span>
                    <ChevronDown size={16} className={`app-navbar-chevron ${showDropdown ? 'rotate' : ''}`} />
                  </button>

                  {showDropdown && (
                    <div className="app-navbar-dropdown-menu">
                      <div className="app-dropdown-header">
                        <p className="app-dropdown-name">{displayName}</p>
                        <p className="app-dropdown-email">{user.email || 'user@vitalis.health'}</p>
                      </div>
                      <hr className="app-dropdown-divider" />
                      <button type="button" className="app-dropdown-item" onClick={() => { setShowDropdown(false); navigate('/app/profile'); }}>
                        <User size={16} /> Profile
                      </button>
                      <button type="button" className="app-dropdown-item" onClick={() => { setShowDropdown(false); navigate('/app/settings'); }}>
                        <Settings size={16} /> Settings
                      </button>
                      <hr className="app-dropdown-divider" />
                      <button type="button" className="app-dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button type="button" className="app-navbar-login" onClick={openLoginModal}>
                Log In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button type="button" className="app-navbar-hamburger" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`app-navbar-mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="app-navbar-mobile-inner">
          {user ? (
            <>
              <button
                type="button"
                className="app-navbar-mobile-link"
                style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '12px 0', fontWeight: 600, color: '#334e68', display: 'block' }}
                onClick={() => { setIsOpen(false); handleDashboardToggle(); }}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="app-navbar-mobile-link"
                style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '12px 0', fontWeight: 600, color: '#334e68', display: 'block' }}
                onClick={() => { setIsOpen(false); navigate('/app/profile'); }}
              >
                Profile
              </button>
              <button
                type="button"
                className="app-navbar-mobile-link"
                style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '12px 0', fontWeight: 600, color: '#334e68', display: 'block' }}
                onClick={() => { setIsOpen(false); navigate('/app/settings'); }}
              >
                Settings
              </button>
              <button type="button" className="app-navbar-mobile-button" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="app-navbar-mobile-link" onClick={() => setIsOpen(false)}>{item}</a>
              ))}
              <button type="button" className="app-navbar-mobile-button" onClick={() => { setIsOpen(false); openLoginModal(); }}>Log In</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
