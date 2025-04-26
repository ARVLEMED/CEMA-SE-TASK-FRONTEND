import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../styles/ProgramEdit.css';

const ProgramEdit = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch program data on mount
  useEffect(() => {
    const fetchProgram = async () => {
      const token = localStorage.getItem('token');
      if (!token || token.split('.').length !== 3) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://cema-se-task-backend.onrender.com/api/programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch program');
        }
        const data = await response.json();
        setName(data.name);
        setDescription(data.description || '');
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProgram();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://cema-se-task-backend.onrender.com/api/programs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to update program');
      }

      setSuccess('Program updated successfully!');
      setTimeout(() => navigate('/programs'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="program-edit-container">
      <MainNavbar />
      <div className="program-edit-card">
        <h2>Edit Program</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Program Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Program'}
          </button>
        </form>
        <button className="cancel-btn" onClick={() => navigate('/programs')} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProgramEdit;