import React from 'react';

export default function Skills({ skills }) {
  if (!skills) return null;

  return (
    <section className="block" id="skills">
      <div className="container">
        <div className="block-header">
          <p className="block-eyebrow">Skills</p>
          <h2 className="block-title">What I work with</h2>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card" key={skill._id}>
              <h3>{skill.category}</h3>
              <div className="tags">
                {skill.items.map((item) => (
                  <span className="tag" key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
