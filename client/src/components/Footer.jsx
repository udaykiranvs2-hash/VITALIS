import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Footer() {
  const { openLoginModal, openRegisterModal } = useAuth();

  return (
    <footer className="site-footer">
      <div>
        <p className="footer-brand">Powered by AI</p>
        <p>Trusted guidance for everyday health decisions.</p>
      </div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <button type="button" onClick={openLoginModal}>Login</button>
        <button type="button" onClick={openRegisterModal}>Register</button>
      </div>
    </footer>
  );
}

export default Footer;
