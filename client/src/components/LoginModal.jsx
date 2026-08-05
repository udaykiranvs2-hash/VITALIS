import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, openRegisterModal, login, loginWithGoogle, loading, error, setError } = useAuth();
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
      setMessage(err.message || 'Unable to sign in.');
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
          <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666', fontSize: '0.9rem' }}>or</div>
          <button type="button" className="secondary-button" onClick={loginWithGoogle} disabled={loading} style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: '8px' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign in with Google
          </button>
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
