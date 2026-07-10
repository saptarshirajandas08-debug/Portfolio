import React, { useEffect, useState } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api.js';

const emptyForm = { category: '', items: '', order: 0 };

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getSkills()
      .then((data) => {
        setSkills(data);
        setStatus('ready');
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message });
        setStatus('error');
      });
  };

  useEffect(load, []);

  const startEdit = (skill) => {
    setEditingId(skill._id);
    setForm({ category: skill.category, items: skill.items.join(', '), order: skill.order });
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
        await updateSkill(editingId, form);
        setMessage({ type: 'success', text: 'Skill category updated.' });
      } else {
        await createSkill(form);
        setMessage({ type: 'success', text: 'Skill category added.' });
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill category?')) return;
    try {
      await deleteSkill(id);
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <>
      <div className="admin-card">
        <h3>{editingId ? 'Edit skill category' : 'Add a skill category'}</h3>

        {message && (
          <div className={message.type === 'error' ? 'form-error' : 'form-success'} style={{ marginBottom: 14 }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row-2">
            <div className="form-row">
              <label>Category name</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Backend"
                required
              />
            </div>
            <div className="form-row">
              <label>Display order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <label>Items (comma separated)</label>
            <input
              value={form.items}
              onChange={(e) => setForm({ ...form, items: e.target.value })}
              placeholder="Node.js, Express.js, REST APIs"
              required
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update category' : 'Add category'}
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
        <h3>Existing skill categories</h3>
        {status === 'loading' && <p className="form-hint">Loading…</p>}
        {status === 'ready' && skills.length === 0 && <p className="form-hint">No skill categories yet.</p>}
        {skills.map((skill) => (
          <div className="admin-list-item" key={skill._id}>
            <div className="info">
              <h4>{skill.category}</h4>
              <p>{skill.items.join(', ')}</p>
            </div>
            <div className="actions">
              <button className="btn btn-outline btn-sm" onClick={() => startEdit(skill)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(skill._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
