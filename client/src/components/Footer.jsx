import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Footer() {
  const { openLoginModal, openRegisterModal } = useAuth();

  return (
    <footer className="site-footer">
      <div className="footer-center">
        <p className="footer-brand">VITALIS</p>
        <p className="footer-subtitle">Trusted guidance for everyday health decisions.</p>
      </div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <span className="footer-divider">•</span>
        <button type="button" onClick={openLoginModal}>Login</button>
        <span className="footer-divider">•</span>
        <button type="button" onClick={openRegisterModal}>Register</button>
      </div>
    </footer>
  );
}

export default Footer;
