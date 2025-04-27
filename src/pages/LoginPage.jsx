import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/home');
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // fallback
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      console.log('Login response body:', text);
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store JWT token
      localStorage.setItem('token', data.access_token);

      // Show success message
      setSuccess('Login successful! Redirecting...');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LandingNavbar />
      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back</h2>
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
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
