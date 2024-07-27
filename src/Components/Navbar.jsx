import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          MyLogo
        </a>
        <button className="navbar-toggler" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <a href="/" className="navbar-link">
              <i className="fas fa-home navbar-icon"></i>
              Meditate
            </a>
          </li>
          <li className="navbar-item">
            <a href="/about" className="navbar-link">
              <i className="fas fa-user navbar-icon"></i>
              Milestones
            </a>
          </li>
          <li className="navbar-item">
            <a href="/services" className="navbar-link">
              <i className="fas fa-cogs navbar-icon"></i>
              Social Journal
            </a>
          </li>
          <li className="navbar-item">
            <a href="/contact" className="navbar-link">
              <i className="fas fa-envelope navbar-icon"></i>
              My Account
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;