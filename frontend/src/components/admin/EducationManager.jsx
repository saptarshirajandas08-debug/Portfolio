import React, { useEffect, useState } from 'react';
import { getEducation, createEducation, updateEducation, deleteEducation } from '../../api.js';

const emptyForm = { year: '', degree: '', institution: '', score: '' };

export default function EducationManager() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getEducation()
      .then((data) => {
        setEntries(data);
        setStatus('ready');
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message });
        setStatus('error');
      });
  };

  useEffect(load, []);

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setForm({ year: entry.year, degree: entry.degree, institution: entry.institution, score: entry.score });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (editingId) {
        await updateEducation(editingId, form);
        setMessage({ type: 'success', text: 'Education entry updated.' });
      } else {
        await createEducation(form);
        setMessage({ type: 'success', text: 'Education entry added.' });
      }
      cancelEdit();
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await deleteEducation(id);
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <>
      <div className="admin-card">
        <h3>{editingId ? 'Edit education entry' : 'Add an education entry'}</h3>

        {message && (
          <div className={message.type === 'error' ? 'form-error' : 'form-success'} style={{ marginBottom: 14 }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row-2">
            <div className="form-row">
              <label>Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
            </div>
            <div className="form-row">
              <label>Score (CGPA / %)</label>
              <input value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <label>Degree</label>
            <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required />
          </div>
          <div className="form-row">
            <label>Institution</label>
            <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update entry' : 'Add entry'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h3>Existing education entries</h3>
        {status === 'loading' && <p className="form-hint">Loading…</p>}
        {status === 'ready' && entries.length === 0 && <p className="form-hint">No entries yet.</p>}
        {entries.map((entry) => (
          <div className="admin-list-item" key={entry._id}>
            <div className="info">
              <h4>{entry.degree} — {entry.year}</h4>
              <p>{entry.institution} · {entry.score}</p>
            </div>
            <div className="actions">
              <button className="btn btn-outline btn-sm" onClick={() => startEdit(entry)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
