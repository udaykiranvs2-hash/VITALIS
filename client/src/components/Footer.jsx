import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-brand">Powered by AI</p>
        <p>Trusted guidance for everyday health decisions.</p>
      </div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </footer>
  );
}

export default Footer;
