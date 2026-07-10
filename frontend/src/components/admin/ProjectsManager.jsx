import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject, ASSET_BASE } from '../../api.js';

const emptyForm = {
  name: '',
  stack: '',
  highlights: '',
  status: 'completed',
  github: '',
  liveUrl: '',
  order: 0
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setStatus('ready');
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message });
        setStatus('error');
      });
  };

  useEffect(load, []);

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      stack: project.stack.join(', '),
      highlights: project.highlights.join('\n'),
      status: project.status,
      github: project.github || '',
      liveUrl: project.liveUrl || '',
      order: project.order
    });
    setImageFile(null);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await updateProject(editingId, fd);
        setMessage({ type: 'success', text: 'Project updated.' });
      } else {
        await createProject(fd);
        setMessage({ type: 'success', text: 'Project added.' });
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
    if (!window.confirm('Delete this project? This also removes its uploaded image.')) return;
    try {
      await deleteProject(id);
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <>
      <div className="admin-card">
        <h3>{editingId ? 'Edit project' : 'Add a project'}</h3>

        {message && (
          <div className={message.type === 'error' ? 'form-error' : 'form-success'} style={{ marginBottom: 14 }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row-2">
            <div className="form-row">
              <label>Project name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-row">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="completed">Completed</option>
                <option value="actively maintained">Actively maintained</option>
                <option value="in progress">In progress</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>Stack (comma separated)</label>
            <input
              value={form.stack}
              onChange={(e) => setForm({ ...form, stack: e.target.value })}
              placeholder="Node.js, Express, MongoDB, React.js"
              required
            />
          </div>

          <div className="form-row">
            <label>Highlights (one per line)</label>
            <textarea
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              placeholder={'Built a full-stack authentication system...\nImplemented OTP-based email verification...'}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-row">
              <label>GitHub URL (optional)</label>
              <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Live URL (optional)</label>
              <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <label>Display order</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </div>

          <div className="form-row">
            <label>Project image</label>
            {editingId && projects.find((p) => p._id === editingId)?.image && (
              <img
                src={`${ASSET_BASE}${projects.find((p) => p._id === editingId).image}`}
                alt="Current"
                style={{ width: 120, height: 70, borderRadius: 8, objectFit: 'cover', marginBottom: 8 }}
              />
            )}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            <span className="form-hint">PNG, JPG, or WEBP, up to 5MB. Leave empty to keep the current image.</span>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update project' : 'Add project'}
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
        <h3>Existing projects</h3>
        {status === 'loading' && <p className="form-hint">Loading…</p>}
        {status === 'ready' && projects.length === 0 && <p className="form-hint">No projects yet.</p>}
        {projects.map((project) => (
          <div className="admin-list-item" key={project._id}>
            <div className="info">
              <h4>{project.name}</h4>
              <p>{project.stack.join(', ')}</p>
            </div>
            <div className="actions">
              <button className="btn btn-outline btn-sm" onClick={() => startEdit(project)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
