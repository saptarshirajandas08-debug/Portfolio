import React from 'react';

export default function Contact({ profile }) {
  if (!profile) return null;

  return (
    <section className="contact-block" id="contact">
      <div className="container">
        <h2>Let's work together</h2>
        <p>Open to full-stack and MERN roles. The fastest way to reach me is email.</p>
        <div className="contact-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </section>
  );
}
