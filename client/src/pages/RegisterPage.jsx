import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterPage() {
  const { register, loginWithGoogle, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/app');
    } catch (err) {
      setMessage(err.message || 'Unable to register.');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h1>Create your account</h1>
        <p>Join AI Health Navigator for guided healthcare support and a secure health profile.</p>
        <form onSubmit={handleSubmit} aria-label="Registration form">
          <label>
            Full name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email address
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666', fontSize: '0.9rem' }}>or</div>
          <button type="button" className="secondary-button" onClick={loginWithGoogle} disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
            Sign up with Google
          </button>
          {message && <p className="form-message error">{message}</p>}
          {error && !message && <p className="form-message error">{error}</p>}
        </form>
        <p className="auth-footnote">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
