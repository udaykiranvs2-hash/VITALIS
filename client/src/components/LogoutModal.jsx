import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import './LogoutModal.css';

export default function LogoutModal() {
  const { isLogoutModalOpen, closeLogoutModal, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogoutModalOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeLogoutModal();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isLogoutModalOpen, closeLogoutModal]);

  if (!isLogoutModalOpen) return null;

  const handleConfirmLogout = async () => {
    closeLogoutModal();
    await logout();
    navigate('/login');
  };

  return (
    <div className="logout-modal-overlay" role="presentation" onMouseDown={closeLogoutModal}>
      <div className="logout-modal-card" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title" onMouseDown={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="logout-modal-close-btn" 
          onClick={closeLogoutModal}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="logout-modal-icon-badge">
          <AlertTriangle size={28} />
        </div>

        <h2 id="logout-modal-title">Confirm Log Out</h2>
        <p className="logout-modal-description">
          Do you really want to log out? You will need to sign in again to access your health reports, symptom checks, and saved records.
        </p>

        <div className="logout-modal-actions">
          <button 
            type="button" 
            className="logout-modal-btn cancel-btn"
            onClick={closeLogoutModal}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="logout-modal-btn confirm-btn"
            onClick={handleConfirmLogout}
          >
            <LogOut size={16} />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
