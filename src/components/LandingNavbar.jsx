// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="../src/assets/logo.png" alt="Arvlemed Logo" className="logo-img" />
      </div>
      <div className="nav-links">
        <Link to="/signup">SIGN UP</Link>
        <Link to="/login">LOG IN</Link>
        <Link to="/about">ABOUT</Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
