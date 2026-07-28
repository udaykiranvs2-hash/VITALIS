import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterModal() {
  const { isRegisterModalOpen, closeRegisterModal, openLoginModal, register, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRegisterModalOpen) return undefined;
    const handleEscape = (event) => event.key === 'Escape' && closeRegisterModal();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isRegisterModalOpen, closeRegisterModal]);

  if (!isRegisterModalOpen) return null;

  const handleClose = () => {
    setMessage('');
    setError('');
    closeRegisterModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await register(form);
      handleClose();
      navigate('/app');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Unable to create your account.');
    }
  };

  const switchToLogin = () => {
    handleClose();
    openLoginModal();
  };

  return (
    <div className="login-modal-overlay" role="presentation" onMouseDown={handleClose}>
      <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="register-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="login-modal-close" onClick={handleClose} aria-label="Close create-account window">&times;</button>
        <p className="login-modal-eyebrow">Get started</p>
        <h1 id="register-modal-title">Create your account</h1>
        <p className="login-modal-copy">Set up your secure Vitalis health profile.</p>
        <form className="login-modal-form" onSubmit={handleSubmit} aria-label="Registration form">
          <label>Full name<input name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required autoComplete="name" /></label>
          <label>Email address<input type="email" name="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="email" /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} autoComplete="new-password" /></label>
          {(message || error) && <p className="form-message error">{message || error}</p>}
          <button type="submit" className="primary-button login-modal-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        </form>
        <div className="login-modal-links"><span>Already have an account? <button type="button" onClick={switchToLogin}>Sign in</button></span></div>
      </section>
    </div>
  );
}

export default RegisterModal;
