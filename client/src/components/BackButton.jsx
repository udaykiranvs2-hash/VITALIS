import { useLocation, useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // A direct visit has no in-app entry to return to, so keep the action useful.
  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(location.pathname.startsWith('/app') ? '/app' : '/');
  };

  if (location.pathname === '/') return null;

  const hasFixedHeader = location.pathname.startsWith('/app') || location.pathname.startsWith('/features');

  return (
    <>
      {!hasFixedHeader && <div className="back-button-safe-area" aria-hidden="true" />}
      <button type="button" className={`back-button${hasFixedHeader ? ' back-button-below-header' : ''}`} onClick={handleBack} aria-label="Go back to the previous page">
        <span aria-hidden="true">&larr;</span>
        Back
      </button>
    </>
  );
}

export default BackButton;
