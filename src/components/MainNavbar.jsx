import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MainNavbar = () => {
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // clear the saved JWT
    navigate('/login'); // redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleHamburgerClick} style={{ cursor: 'pointer' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
        >
          <path d="M3 12h18M3 6h18M3 18h18" stroke="#000" strokeWidth="2" />
        </svg>
      </div>

      <div className="nav-links">
        <Link to="/clients">CLIENTS</Link>
        <Link to="/programs">PROGRAMS</Link>
        <Link to="/consultation">CONSULTATION</Link>
      </div>

      <div className="exit-icon" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </nav>
  );
};

export default MainNavbar;
