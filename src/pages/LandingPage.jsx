import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <LandingNavbar />  {/* Corrected this line */}

      {/* Hero Section */}
      <section className="hero">
        <img src="../src/assets/hospital.jpg" alt="Hospital Building" className="hero-img" />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
