import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const { user, login, loginWithGoogle, logout, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setMessage(err.message || 'Unable to sign in.');
    }
  };

  const handleLogout = () => {
    logout();
    setForm({ email: '', password: '' });
    setShowPassword(false);
    setError('');
    setMessage('You have been signed out.');
    navigate('/login');
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        {user && (
          <div className="account-menu">
            <p>Signed in as {user.name || user.email}</p>
            <button type="button" className="secondary-button danger" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
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
          <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666', fontSize: '0.9rem' }}>or</div>
          <button type="button" className="secondary-button" onClick={loginWithGoogle} disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
            Sign in with Google
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
