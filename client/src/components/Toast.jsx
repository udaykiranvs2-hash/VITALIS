function Toast({ message, type = 'info', onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
}

export default Toast;
