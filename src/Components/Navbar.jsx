import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaHome, FaUser, FaCogs, FaEnvelope } from 'react-icons/fa';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            MyLogo
          </Link>
          <button className="navbar-toggler" onClick={toggleMenu}>
            ☰
          </button>
          <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="navbar-item">
              <Link to="/" className="navbar-link">
                <FaHome className="navbar-icon" />
                Meditate
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/about" className="navbar-link">
                <FaUser className="navbar-icon" />
                Milestones
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/challenges" className="navbar-link">
                <FaCogs className="navbar-icon" />
                Challenges
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/contact" className="navbar-link">
                <FaEnvelope className="navbar-icon" />
                My Account
              </Link>
            </li>
          </ul>
        </div>
      </nav>
  );
}

export default Navbar;
