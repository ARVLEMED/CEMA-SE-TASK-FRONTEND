import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import MainNavbar from '../components/MainNavbar';
import consultationImage from '../assets/consultation.jpg';

function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const hour = currentTime.getHours();
  let greeting = '';
  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  return (
    <div className="container">
      <MainNavbar />
      <div
        className="main-content"
        style={{ backgroundImage: `url(${consultationImage})` }}
      >
        <div className="greeting-box">
          <h1>{greeting}, Dr. Koech</h1>
          <p className="greeting-subtitle">
            Welcome to Arvlemed Hospital's Health Information System
          </p>
        </div>
        <div className="cta-section">
          <h2>Get Started</h2>
          <div className="cta-buttons">
            <Link to="/consultation" className="cta-btn">
              Start Consultation
            </Link>
            <Link to="/register" className="cta-btn">
              Register Client
            </Link>
            <Link to="/clients" className="cta-btn">
              View Clients
            </Link>
            <Link to="/programs" className="cta-btn">
              Manage Programs
            </Link>
          </div>
        </div>
        <div className="clock">
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;