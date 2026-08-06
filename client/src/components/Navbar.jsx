import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboard } from '../context/DashboardContext.jsx';
import { Menu, X, HeartPulse, Bell, ChevronDown, User, Settings, LogOut, LayoutDashboard, Calendar, Stethoscope, Inbox, Search, Sun, Moon, Activity, FileText, Scan, DollarSign, Users, History, Pill, Bot } from 'lucide-react';
import './Navbar.css';

const APP_ROUTES = [
  { label: 'Home', path: '/app', icon: 'HeartPulse', keywords: ['home', 'dashboard', 'main', 'start', 'overview'] },
  { label: 'Symptom Checker', path: '/app/symptoms', icon: 'Activity', keywords: ['symptom', 'checker', 'symptoms', 'check symptoms', 'diagnose', 'illness', 'sick', 'pain', 'fever', 'disease'] },
  { label: 'Report Analysis', path: '/app/report', icon: 'FileText', keywords: ['report', 'analysis', 'lab', 'blood test', 'medical report', 'document', 'pdf', 'upload report', 'lab results'] },
  { label: 'X-ray Analysis', path: '/app/xray', icon: 'Scan', keywords: ['xray', 'x-ray', 'x ray', 'scan', 'radiology', 'chest xray', 'bone', 'image analysis', 'imaging'] },
  { label: 'Cost Estimator', path: '/app/cost', icon: 'DollarSign', keywords: ['cost', 'estimator', 'price', 'fee', 'estimate', 'treatment cost', 'hospital cost', 'expense', 'budget', 'how much'] },
  { label: 'Find Doctors', path: '/app/doctors', icon: 'Users', keywords: ['doctor', 'doctors', 'specialist', 'physician', 'cardiologist', 'dermatologist', 'find doctor', 'book appointment', 'appointment', 'consult', 'neurology'] },
  { label: 'Health History', path: '/app/history', icon: 'History', keywords: ['history', 'past', 'records', 'consultations', 'past appointments', 'timeline', 'health records', 'previous'] },
  { label: 'Medicine Info', path: '/app/medicine', icon: 'Pill', keywords: ['medicine', 'drug', 'medication', 'pill', 'tablet', 'prescription', 'pharma', 'dosage', 'side effects'] },
  { label: 'AI Assistant', path: '/app/assistant', icon: 'Bot', keywords: ['ai', 'assistant', 'chat', 'ask', 'help', 'bot', 'ai chat', 'vitalis ai', 'question', 'query'] },
  { label: 'Profile', path: '/app/profile', icon: 'User', keywords: ['profile', 'my profile', 'account', 'personal', 'details', 'edit profile', 'name', 'photo'] },
  { label: 'Settings', path: '/app/settings', icon: 'Settings', keywords: ['settings', 'preferences', 'theme', 'dark mode', 'password', 'change password', 'notifications', 'privacy', 'account settings'] },
];

const ROUTE_ICONS = { HeartPulse, Activity, FileText, Scan, DollarSign, Users, History, Pill, Bot, User, Settings };


export default function Navbar({ darkMode, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, openLogoutModal, openLoginModal } = useAuth();
  const { showDashboard, toggleDashboard, closeDashboard } = useDashboard();
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search results on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
        setSelectedIndex(-1);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = ['Features', 'Doctors', 'Pricing', 'About', 'Contact'];

  // --- Search logic ---
  const filteredRoutes = searchQuery.trim().length > 0
    ? APP_ROUTES.filter(route =>
        route.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearchKeyDown = (e) => {
    if (!showSearchResults || filteredRoutes.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredRoutes.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const target = selectedIndex >= 0 ? filteredRoutes[selectedIndex] : filteredRoutes[0];
      if (target) navigateToRoute(target);
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery('');
      setSelectedIndex(-1);
    }
  };

  const navigateToRoute = (route) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedIndex(-1);
    navigate(route.path);
  };

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
    openLogoutModal();
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

          {/* Search bar - center */}
          {user && (
            <div className="app-navbar-search" ref={searchRef}>
              <Search size={15} className="app-navbar-search-icon" />
              <input
                type="text"
                className="app-navbar-search-input"
                placeholder="Search features, doctors, tools..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.trim().length > 0);
                  setSelectedIndex(-1);
                }}
                onFocus={() => searchQuery.trim().length > 0 && setShowSearchResults(true)}
                onKeyDown={handleSearchKeyDown}
                autoComplete="off"
              />
              {searchQuery && (
                <button className="app-search-clear" onClick={() => { setSearchQuery(''); setShowSearchResults(false); }} aria-label="Clear search">
                  <X size={13} />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && filteredRoutes.length > 0 && (
                <div className="app-search-dropdown">
                  {filteredRoutes.map((route, i) => {
                    const IconComp = ROUTE_ICONS[route.icon];
                    return (
                      <button
                        key={route.path}
                        className={`app-search-result-item ${i === selectedIndex ? 'selected' : ''}`}
                        onMouseDown={() => navigateToRoute(route)}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <span className="app-search-result-icon">
                          {IconComp && <IconComp size={16} />}
                        </span>
                        <span className="app-search-result-label">{route.label}</span>
                        <span className="app-search-result-path">{route.path.replace('/app', '')}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {showSearchResults && filteredRoutes.length === 0 && searchQuery.trim().length > 0 && (
                <div className="app-search-dropdown app-search-empty">
                  <Search size={18} />
                  <p>No results for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

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
                {/* Theme toggle orb */}
                <button
                  type="button"
                  className={`app-navbar-theme-orb ${darkMode ? 'dark' : 'light'}`}
                  onClick={onToggleTheme}
                  aria-label="Toggle dark mode"
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Moon size={14} strokeWidth={2.5} /> : <Sun size={14} strokeWidth={2.5} />}
                </button>

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
