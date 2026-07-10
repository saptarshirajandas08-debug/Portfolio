import React from 'react';
import { ASSET_BASE } from '../api.js';

export default function Hero({ profile }) {
  if (!profile) return null;

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">{profile.role}</p>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-tagline">{profile.tagline}</p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">View projects</a>
            <a className="btn btn-outline" href="#contact">Get in touch</a>
          </div>

          <div className="stack-strip" aria-label="Primary stack: MongoDB, Express, React, Node">
            <div className="stack-seg" data-layer="mongo">
              <div className="bar" />
              <div className="label">Mongo</div>
            </div>
            <div className="stack-seg" data-layer="express">
              <div className="bar" />
              <div className="label">Express</div>
            </div>
            <div className="stack-seg" data-layer="react">
              <div className="bar" />
              <div className="label">React</div>
            </div>
            <div className="stack-seg" data-layer="node">
              <div className="bar" />
              <div className="label">Node</div>
            </div>
          </div>
        </div>

        <div className="hero-avatar-wrap">
          {profile.avatar ? (
            <img src={`${ASSET_BASE}${profile.avatar}`} alt={profile.name} />
          ) : (
            <span className="hero-avatar-fallback">{initials}</span>
          )}
        </div>
      </div>
    </section>
  );
}
