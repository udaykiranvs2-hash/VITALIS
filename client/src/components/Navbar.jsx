import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, HeartPulse } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout, openLoginModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Features', 'Doctors', 'Pricing', 'About', 'Contact'];
  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className={`app-navbar ${scrolled ? 'scrolled' : 'top'}`}>
      <div className="app-navbar-container">
        <div className="app-navbar-row">
          <button type="button" className="app-navbar-logo" onClick={() => navigate('/')}>
            <div className="app-navbar-logo-mark"><HeartPulse size={22} /></div>
            <div className="app-navbar-logo-text"><p>VITALIS</p><span>AI Health Navigator</span></div>
          </button>

          <nav className="app-navbar-links">
            {navLinks.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
          </nav>

          <div className="app-navbar-actions">
            {user ? (
              <button type="button" className="app-account-button" onClick={handleLogout}>
                {user.name || user.email} · Log out
              </button>
            ) : (
              <>
                <button type="button" className="app-navbar-login" onClick={openLoginModal}>
                  Log In
                </button>
              </>
            )}
          </div>

          <button type="button" className="app-navbar-hamburger" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div className={`app-navbar-mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="app-navbar-mobile-inner">
          {navLinks.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="app-navbar-mobile-link" onClick={() => setIsOpen(false)}>{item}</a>
          ))}
          {user ? (
            <button type="button" className="app-navbar-mobile-button" onClick={() => { setIsOpen(false); handleLogout(); }}>Log out</button>
          ) : (
            <>
              <button type="button" className="app-navbar-mobile-button" onClick={() => { setIsOpen(false); openLoginModal(); }}>Log In</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
