import React, { useState } from 'react';
import './Navbar.css';
import { FaHome, FaUser, FaCogs, FaEnvelope } from 'react-icons/fa';

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
              <FaHome className="navbar-icon" />
              Meditate
            </a>
          </li>
          <li className="navbar-item">
            <a href="/about" className="navbar-link">
              <FaUser className="navbar-icon" />
              Milestones
            </a>
          </li>
          <li className="navbar-item">
            <a href="/services" className="navbar-link">
              <FaCogs className="navbar-icon" />
              Social Journal
            </a>
          </li>
          <li className="navbar-item">
            <a href="/contact" className="navbar-link">
              <FaEnvelope className="navbar-icon" />
              My Account
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;