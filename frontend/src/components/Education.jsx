import React from 'react';

export default function Education({ education }) {
  if (!education) return null;

  return (
    <section className="block" id="education">
      <div className="container">
        <div className="block-header">
          <p className="block-eyebrow">Education</p>
          <h2 className="block-title">Academic background</h2>
        </div>

        <div className="timeline">
          {education.map((entry) => (
            <div className="tl-item" key={entry._id}>
              <div className="tl-year">{entry.year}</div>
              <div className="tl-title">{entry.degree}</div>
              <div className="tl-sub">{entry.institution} · {entry.score}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
