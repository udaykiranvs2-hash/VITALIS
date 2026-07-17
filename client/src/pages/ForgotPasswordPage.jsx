import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword as forgotPasswordRequest } from '../api/api.js';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await forgotPasswordRequest({ email });
      setMessage(response.data.message || 'If your email exists, you will receive instructions shortly.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h1>Reset your password</h1>
        <p>Enter the email associated with your account and we will send reset instructions.</p>
        <form onSubmit={handleSubmit} aria-label="Forgot password form">
          <label>
            Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
          {message && <p className="form-message success">{message}</p>}
          {error && <p className="form-message error">{error}</p>}
        </form>
        <p className="auth-footnote">
          Return to <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
