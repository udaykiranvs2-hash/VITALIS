import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboard } from '../context/DashboardContext.jsx';
import { Menu, X, HeartPulse, Bell, ChevronDown, User, Settings, LogOut, LayoutDashboard, Calendar, Stethoscope, Inbox } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, openLoginModal } = useAuth();
  const { showDashboard, toggleDashboard, closeDashboard } = useDashboard();
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  const navLinks = ['Features', 'Doctors', 'Pricing', 'About', 'Contact'];

  const appointments = Array.isArray(user?.appointments) ? user.appointments : [];

  const notificationItems = appointments
    .slice()
    .sort((a, b) => {
      const da = new Date(`${a.date}T${a.time || '00:00'}`);
      const db = new Date(`${b.date}T${b.time || '00:00'}`);
      return da - db;
    })
    .map((apt, idx) => ({
      id: apt.id || apt._id || `apt-${idx}`,
      title: `Appointment with ${apt.doctorName || 'Your Doctor'}`,
      subtitle: apt.specialty || 'Consultation',
      time: `${apt.date || 'TBD'} ${apt.time ? '• ' + apt.time : ''}`,
      status: apt.status || 'Scheduled'
    }));

  const handleLogout = () => {
    setIsOpen(false);
    setShowDropdown(false);
    setShowNotifications(false);
    closeDashboard();
    logout();
    navigate('/');
  };

  const handleDashboardToggle = () => {
    if (showDashboard) {
      closeDashboard();
      navigate('/app');
    } else {
      toggleDashboard();
      navigate('/app/symptoms');
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
                <div className="app-navbar-notifications-wrapper" ref={notificationsRef}>
                  <button
                    type="button"
                    className="app-navbar-bell"
                    aria-label="Notifications"
                    onClick={() => {
                      setShowDropdown(false);
                      setShowNotifications((v) => !v);
                    }}
                  >
                    <Bell size={20} />
                    {notificationItems.length > 0 && (
                      <span className="app-navbar-bell-badge">{notificationItems.length}</span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="app-navbar-notifications-panel">
                      <div className="app-notifications-header">
                        <h3>Notifications</h3>
                        <span className="app-notifications-count">{notificationItems.length}</span>
                      </div>
                      <hr className="app-dropdown-divider" />
                      {notificationItems.length === 0 ? (
                        <div className="app-notifications-empty">
                          <Inbox size={28} />
                          <p>No new notifications</p>
                        </div>
                      ) : (
                        <ul className="app-notifications-list">
                          {notificationItems.map((n) => (
                            <li
                              key={n.id}
                              className="app-notification-item"
                              onClick={() => {
                                setShowNotifications(false);
                                navigate('/app/history');
                              }}
                            >
                              <div className="app-notification-icon">
                                <Calendar size={18} />
                              </div>
                              <div className="app-notification-content">
                                <p className="app-notification-title">{n.title}</p>
                                <p className="app-notification-sub">
                                  <Stethoscope size={12} /> {n.subtitle}
                                </p>
                                <p className="app-notification-meta">
                                  {n.time} • <span className={`appt-status ${n.status?.toLowerCase()}`}>{n.status}</span>
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

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
