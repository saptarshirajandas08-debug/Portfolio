import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, ASSET_BASE } from '../../api.js';

const TEXT_FIELDS = ['name', 'role', 'tagline', 'summary', 'location', 'email', 'phone', 'linkedin', 'github'];
const ARRAY_FIELDS = ['foundation', 'stack', 'alsoShippedIn'];

export default function ProfileEditor() {
  const [form, setForm] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [status, setStatus] = useState('loading');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error'|'success', text }

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setForm({
          ...profile,
          foundation: profile.foundation.join(', '),
          stack: profile.stack.join(', '),
          alsoShippedIn: (profile.alsoShippedIn || []).join(', ')
        });
        setStatus('ready');
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message });
        setStatus('error');
      });
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const fd = new FormData();
      TEXT_FIELDS.forEach((field) => fd.append(field, form[field] || ''));
      ARRAY_FIELDS.forEach((field) => fd.append(field, form[field] || ''));
      if (avatarFile) fd.append('avatar', avatarFile);

      const updated = await updateProfile(fd);
      setForm({
        ...updated,
        foundation: updated.foundation.join(', '),
        stack: updated.stack.join(', '),
        alsoShippedIn: (updated.alsoShippedIn || []).join(', ')
      });
      setAvatarFile(null);
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return <p className="form-hint">Loading profile…</p>;
  if (status === 'error') return <div className="form-error">{message?.text}</div>;

  return (
    <div className="admin-card">
      <h3>Profile &amp; contact details</h3>

      {message && (
        <div className={message.type === 'error' ? 'form-error' : 'form-success'} style={{ marginBottom: 14 }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row-2">
          <div className="form-row">
            <label>Name</label>
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Role / title</label>
            <input value={form.role} onChange={(e) => handleChange('role', e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <label>Tagline (shown under your name)</label>
          <textarea value={form.tagline} onChange={(e) => handleChange('tagline', e.target.value)} required />
        </div>

        <div className="form-row">
          <label>Summary (About section)</label>
          <textarea value={form.summary} onChange={(e) => handleChange('summary', e.target.value)} required />
        </div>

        <div className="form-row">
          <label>Core stack (comma separated)</label>
          <input value={form.stack} onChange={(e) => handleChange('stack', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Foundation (comma separated)</label>
          <input value={form.foundation} onChange={(e) => handleChange('foundation', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Also shipped in (comma separated)</label>
          <input value={form.alsoShippedIn} onChange={(e) => handleChange('alsoShippedIn', e.target.value)} />
        </div>

        <div className="form-row-2">
          <div className="form-row">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <label>Location</label>
          <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} required />
        </div>

        <div className="form-row-2">
          <div className="form-row">
            <label>LinkedIn URL</label>
            <input value={form.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} required />
          </div>
          <div className="form-row">
            <label>GitHub URL</label>
            <input value={form.github} onChange={(e) => handleChange('github', e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <label>Profile photo</label>
          {form.avatar && (
            <img
              src={`${ASSET_BASE}${form.avatar}`}
              alt="Current avatar"
              style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', marginBottom: 8 }}
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
          <span className="form-hint">PNG, JPG, or WEBP, up to 5MB. Leave empty to keep the current photo.</span>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
