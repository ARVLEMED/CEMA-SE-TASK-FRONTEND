import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <LandingNavbar />  

      {/* Hero Section */}
      <section className="hero">
        <img src="../src/assets/hospital.jpg" alt="Hospital Building" className="hero-img" />
        
        {/* Button for opening PowerPoint in the browser */}
        <a href="/files/project-presentation.pptx.pdf" target="_blank" rel="noopener noreferrer">
          <button className="download-btn">Open the Project PowerPoint</button>
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
