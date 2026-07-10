import React from 'react';

export default function About({ profile }) {
  if (!profile) return null;

  return (
    <section className="block" id="about">
      <div className="container">
        <div className="block-header">
          <p className="block-eyebrow">About</p>
          <h2 className="block-title">A bit about how I work</h2>
        </div>

        <div className="about-grid">
          <p className="about-summary">{profile.summary}</p>

          <div>
            <div className="tag-group">
              <div className="tag-group-label">Core stack</div>
              <div className="tags">
                {profile.stack.map((item) => (
                  <span className="tag tag-teal" key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="tag-group">
              <div className="tag-group-label">Foundation</div>
              <div className="tags">
                {profile.foundation.map((item) => (
                  <span className="tag" key={item}>{item}</span>
                ))}
              </div>
            </div>
            {profile.alsoShippedIn?.length > 0 && (
              <div className="tag-group">
                <div className="tag-group-label">Also shipped in</div>
                <div className="tags">
                  {profile.alsoShippedIn.map((item) => (
                    <span className="tag" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
