import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(data.message || 'Signup failed');
      }

      // OPTIONAL: If you want to auto-login after signup
      // localStorage.setItem('accessToken', data.access_token);
      // navigate('/dashboard'); // Redirect to a protected page

      setSuccess('Account created successfully! Please log in.');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <>
      <LandingNavbar />
      <div className="signup-container">
        <div className="signup-card">
          <h2>Create Account</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          {!success && (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="E.g. johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          )}
          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
