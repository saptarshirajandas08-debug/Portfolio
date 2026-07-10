import React from 'react';
import { ASSET_BASE } from '../api.js';

const LAYERS = [
  { key: 'mongo', match: /mongo/i },
  { key: 'express', match: /express/i },
  { key: 'react', match: /react/i },
  { key: 'node', match: /node/i }
];

function layerIsOn(stack, layer) {
  return stack.some((item) => layer.match.test(item));
}

export default function Projects({ projects }) {
  if (!projects) return null;

  return (
    <section className="block" id="projects">
      <div className="container">
        <div className="block-header">
          <p className="block-eyebrow">Work</p>
          <h2 className="block-title">Projects</h2>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div className="project-card" key={project._id}>
              <div className="project-image">
                {project.image ? (
                  <img src={`${ASSET_BASE}${project.image}`} alt={project.name} />
                ) : (
                  <span className="placeholder">{project.name}</span>
                )}
              </div>

              <div className="project-body">
                <div className="project-top">
                  <h3 className="project-title">{project.name}</h3>
                  <span className="status-pill">{project.status}</span>
                </div>

                <div className="mini-stack-strip" aria-hidden="true">
                  {LAYERS.map((layer) => (
                    <span
                      key={layer.key}
                      className={`dot ${layerIsOn(project.stack, layer) ? 'on' : ''}`}
                      data-layer={layer.key}
                    />
                  ))}
                </div>

                <ul className="project-highlights">
                  {project.highlights.slice(0, 3).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>

                {(project.github || project.liveUrl) && (
                  <div className="project-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">Code</a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live</a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
