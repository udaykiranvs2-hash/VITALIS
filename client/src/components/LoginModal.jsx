import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, openRegisterModal, login, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoginModalOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeLoginModal();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setMessage('');
    setError('');
    closeLoginModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await login({ email: form.email.trim().toLowerCase(), password: form.password });
      handleClose();
      navigate('/app');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Unable to sign in.');
    }
  };

  return (
    <div className="login-modal-overlay" role="presentation" onMouseDown={handleClose}>
      <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="login-modal-close" onClick={handleClose} aria-label="Close sign in window">&times;</button>
        <p className="login-modal-eyebrow">Welcome back</p>
        <h1 id="login-modal-title">Sign in to Vitalis</h1>
        <p className="login-modal-copy">Access your health dashboard and care tools.</p>

        <form className="login-modal-form" onSubmit={handleSubmit} aria-label="Login form">
          <label>
            Email address
            <input type="email" name="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="email" />
          </label>
          <label>
            Password
            <div className="login-modal-password">
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          {(message || error) && <p className="form-message error">{message || error}</p>}
          <button type="submit" className="primary-button login-modal-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>

        <div className="login-modal-links">
          <button type="button" onClick={() => { handleClose(); navigate('/forgot-password'); }}>Forgot password?</button>
          <span>New here? <button type="button" onClick={() => { handleClose(); openRegisterModal(); }}>Create an account</button></span>
        </div>
      </section>
    </div>
  );
}

export default LoginModal;
