import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';
import { SOURCES, STATUSES } from '../config/constants';
import { validateLead, errorMessage } from '../utils/validate';
import { CloseIcon } from './Icons';

const EMPTY = { name: '', email: '', phone: '', company: '', source: '', status: 'New' };

export default function LeadModal({ lead, onClose, onSaved }) {
  const isEdit = !!lead;
  const [form, setForm] = useState(isEdit ? { ...EMPTY, ...lead } : EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validateLead(form);
    if (Object.keys(found).length) return setErrors(found);

    setSaving(true);
    try {
      const body = { name: form.name, email: form.email, phone: form.phone, company: form.company, source: form.source, status: form.status };
      if (isEdit) await api.put(`/leads/${lead._id}`, body);
      else await api.post('/leads', body);
      toast.success(isEdit ? 'Lead updated' : 'Lead added');
      onSaved();
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const field = (id, label, props = {}) => (
    <div className={`field ${errors[id] ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={form[id]} onChange={set(id)} {...props} />
      {errors[id] && <small>{errors[id]}</small>}
    </div>
  );

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form className="dialog" noValidate onSubmit={submit} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="dialog-head">
          <h3>{isEdit ? 'Edit lead' : 'Add lead'}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>

        <div className="form-grid">
          {field('name', 'Full name', { placeholder: 'Asha Rao', autoFocus: true })}
          {field('company', 'Company', { placeholder: 'Acme Inc.' })}
          {field('email', 'Email', { type: 'email', placeholder: 'asha@acme.com' })}
          {field('phone', 'Phone', { type: 'tel', placeholder: '+91 98765 43210' })}

          <div className={`field ${errors.source ? 'has-error' : ''}`}>
            <label htmlFor="source">Source</label>
            <select id="source" value={form.source} onChange={set('source')}>
              <option value="">Select source</option>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.source && <small>{errors.source}</small>}
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add lead'}</button>
        </div>
      </form>
    </div>
  );
}
