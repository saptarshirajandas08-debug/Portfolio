import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';
import Projects from '../components/Projects.jsx';
import Education from '../components/Education.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import { getProfile, getSkills, getProjects, getEducation } from '../api.js';

export default function Portfolio() {
  const [data, setData] = useState({ profile: null, skills: null, projects: null, education: null });
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profile, skills, projects, education] = await Promise.all([
          getProfile(),
          getSkills(),
          getProjects(),
          getEducation()
        ]);
        if (cancelled) return;
        setData({ profile, skills, projects, education });
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err.message || 'Could not reach the API');
        setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return <div className="state-message">Loading portfolio…</div>;
  }

  if (status === 'error') {
    return (
      <div className="state-message error">
        Couldn't load the portfolio: {errorMessage}
        <br />
        Make sure the backend is running and VITE_API_URL is set correctly.
      </div>
    );
  }

  const initials = data.profile.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <>
      <Navbar initials={initials} />
      <Hero profile={data.profile} />
      <About profile={data.profile} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Education education={data.education} />
      <Contact profile={data.profile} />
      <Footer />
    </>
  );
}
