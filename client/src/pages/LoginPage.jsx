import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const { user, login, logout, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password
    };
    try {
      await login(payload);
      navigate('/app');
    } catch (err) {
      const serverMessage = err?.response?.data?.message || 'Unable to sign in.';
      setMessage(serverMessage);
    }
  };

  const handleLogout = () => {
    logout();
    setForm({ email: '', password: '' });
    setShowPassword(false);
    setMenuOpen(false);
    setError('');
    setMessage('You have been signed out. You can sign in with a different account now.');
    navigate('/login');
  };

  const handleSwitchAccount = () => {
    logout();
    setMenuOpen(false);
    setForm({ email: '', password: '' });
    setShowPassword(false);
    setError('');
    setMessage('Switch account mode enabled. Enter a different email and password to sign in.');
    navigate('/login');
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div className="account-menu">
          <button type="button" className="account-menu-button" onClick={() => setMenuOpen((value) => !value)}>
            {user ? (user.name || user.email) : 'Account'} ▾
          </button>
          {menuOpen && (
            <div className="account-menu-card">
              <p>{user ? `Signed in as ${user.name || user.email}` : 'Not signed in'}</p>
              {user ? (
                <>
                  <button type="button" className="secondary-button" onClick={handleSwitchAccount}>
                    Switch account
                  </button>
                  <button type="button" className="secondary-button danger" onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <button type="button" className="secondary-button" onClick={() => navigate('/login')}>
                  Sign in
                </button>
              )}
            </div>
          )}
        </div>
        <h1>Sign in to AI Health Navigator</h1>
        <p>Access your health dashboard, symptom tools and report analysis.</p>

        <form onSubmit={handleSubmit} aria-label="Login form">
          <label>
            Email address
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          {message && <p className="form-message error">{message}</p>}
          {error && !message && <p className="form-message error">{error}</p>}
        </form>
        <div className="auth-footnote">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>
            New here? <Link to="/register">Create an account</Link>
          </span>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
