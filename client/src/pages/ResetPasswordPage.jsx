import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { resetPassword as resetPasswordRequest } from '../api/api.js';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordRequest({ token, newPassword: password });
      setMessage('Your password has been reset. Please sign in again.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h1>Choose a new password</h1>
        <p>Enter your new password to regain access to your account.</p>
        <form onSubmit={handleSubmit} aria-label="Reset password form">
          <label>
            New password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </label>
          <label>
            Confirm new password
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} />
          </label>
          <button type="submit" className="primary-button" disabled={loading || !token}>
            {loading ? 'Updating…' : 'Reset password'}
          </button>
          {message && <p className="form-message success">{message}</p>}
          {error && <p className="form-message error">{error}</p>}
          {!token && <p className="form-message error">Reset token is missing. Please request a new link.</p>}
        </form>
        <p className="auth-footnote">
          Return to <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
