import React from 'react';
import '../styles/AboutPage.css';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

function AboutPage() {
  return (
    <>
      <LandingNavbar />
      <div className="about-container">
        <header className="about-header">
          <h1>About Arvlemed Hospital</h1>
        </header>

        <section className="about-content">
          <div className="about-description">
            <p>
              Arvlemed Hospital is a state-of-the-art medical facility dedicated to providing exceptional healthcare services to our community. Founded with a mission to prioritize patient well-being, we offer a wide range of specialized treatments and compassionate care in a modern, welcoming environment.
            </p>
            <p>
              Our team of highly skilled doctors, nurses, and staff is committed to delivering personalized medical care, ensuring every patient receives the attention and support they need. Equipped with advanced technology and innovative practices, Arvlemed Hospital excels in areas such as emergency care, surgical services, diagnostics, and preventive health programs.
            </p>
            <p>
              At Arvlemed, we believe in holistic healing, fostering both physical and emotional wellness. Our patient-centered approach, combined with a focus on accessibility and inclusivity, makes us a trusted healthcare provider for families across the region. We are proud to serve and support our diverse community with integrity and excellence.
            </p>
          </div>

          <div className="about-system">
            <h2>Our Health Information System</h2>
            <p>
              Arvlemed Hospital leverages a cutting-edge Health Information System to streamline patient care and program management. Key features include:
            </p>
            <ul>
              <li>Client Registration: Easily onboard new patients with comprehensive profiles.</li>
              <li>Health Programs: Manage specialized programs like TB, Malaria, and HIV care.</li>
              <li>Consultation Queue: Efficiently handle patient consultations with a prioritized queue.</li>
              <li>Client Search: Quickly find patient records for seamless care delivery.</li>
              <li>Secure API: Enable integration with other systems for enhanced interoperability.</li>
            </ul>
            <p>
              Our system ensures secure, efficient, and patient-focused healthcare delivery, aligning with our mission to provide top-tier medical services.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default AboutPage;