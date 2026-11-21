import { useEffect } from 'react';

export default function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="overlay" onMouseDown={onCancel}>
      <div className="dialog dialog-sm" role="alertdialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted">{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy} autoFocus>{busy ? 'Deleting…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
