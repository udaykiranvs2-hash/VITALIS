import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Toast from '../components/Toast.jsx';

function SettingsPage({ darkMode, onToggleTheme }) {
  const { changePassword } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (event) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast('New passwords do not match.');
      return;
    }
    setLoading(true);
    setToast('');
    try {
      await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setToast('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setToast('Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page settings-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Security, notifications and theme preferences.</h1>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <section className="settings-grid">
        <article>
          <h2>Appearance</h2>
          <p>Switch between light and dark mode to match your environment.</p>
          <button type="button" className="primary-button" onClick={onToggleTheme}>
            {darkMode ? 'Use light mode' : 'Use dark mode'}
          </button>
        </article>
        <article>
          <h2>Change password</h2>
          <form onSubmit={handlePasswordSubmit} aria-label="Password change form">
            <label>
              Current password
              <input name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} required />
            </label>
            <label>
              New password
              <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} required minLength={8} />
            </label>
            <label>
              Confirm password
              <input name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required minLength={8} />
            </label>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </article>
      </section>
    </div>
  );
}

export default SettingsPage;
