import React from 'react';

export default function Navbar({ initials }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">{initials}</span>
          <span>Saptarshi Rajan Das</span>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Work</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </div>
  );
}
