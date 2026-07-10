import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../auth.js';
import ProfileEditor from '../components/admin/ProfileEditor.jsx';
import SkillsManager from '../components/admin/SkillsManager.jsx';
import ProjectsManager from '../components/admin/ProjectsManager.jsx';
import EducationManager from '../components/admin/EducationManager.jsx';

const TABS = [
  { id: 'profile', label: 'Profile', title: 'Profile & contact', sub: 'Your name, tagline, summary, contact details, and photo.' },
  { id: 'skills', label: 'Skills', title: 'Skills', sub: 'Grouped skill categories shown on the Skills section.' },
  { id: 'projects', label: 'Projects', title: 'Projects', sub: 'Your project showcase, including images and links.' },
  { id: 'education', label: 'Education', title: 'Education', sub: 'Your academic timeline.' }
];

export default function AdminDashboard() {
  const [active, setActive] = useState('profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  const currentTab = TABS.find((t) => t.id === active);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Portfolio Admin</div>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-nav-btn ${active === tab.id ? 'active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button className="admin-nav-btn logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="admin-main">
        <h1>{currentTab.title}</h1>
        <p className="admin-sub">{currentTab.sub}</p>

        {active === 'profile' && <ProfileEditor />}
        {active === 'skills' && <SkillsManager />}
        {active === 'projects' && <ProjectsManager />}
        {active === 'education' && <EducationManager />}
      </main>
    </div>
  );
}
