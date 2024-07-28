import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaHome, FaUser, FaCogs, FaEnvelope } from 'react-icons/fa';
import Oasis from './Oasis.png';
import { SiMediamarkt } from 'react-icons/si';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={Oasis} alt="Meditation App Logo" className="navbar-icon2" />
                </Link>
                <button className="navbar-toggler" onClick={toggleMenu}>
                    ☰
                </button>
                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li className="navbar-item">
                        <Link to="/Meditate" className="navbar-link">
                            <SiMediamarkt className="navbar-icon" />
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
