import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../styles/ProgramsPage.css';

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProgram, setNewProgram] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async (search = '') => {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://cema-se-task-backend.onrender.com/api/programs?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError(error.message);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchPrograms(term);
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://cema-se-task-backend.onrender.com/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProgram.name,
          description: newProgram.description,
        }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to add program');
      }
      const data = await response.json();
      setPrograms([...programs, data]);
      setNewProgram({ name: '', description: '' });
      setShowAddForm(false);
      setSuccess('Program added successfully!');
    } catch (error) {
      console.error('Error adding program:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://cema-se-task-backend.onrender.com/api/programs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to delete program');
      }
      setPrograms(programs.filter((program) => program.id !== id));
      setSuccess('Program deleted successfully!');
    } catch (error) {
      console.error('Error deleting program:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <MainNavbar />
      <div className="programs-section">
        <div className="programs-header">
          <h2>HEALTH PROGRAMS</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search programs (e.g., TB Clinic)"
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button
            className="add-program-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'CANCEL' : 'ADD PROGRAM'}
          </button>
        </div>

        {showAddForm && (
          <form className="add-program-form" onSubmit={handleAddProgram}>
            <div className="form-group">
              <label>Program Name</label>
              <input
                type="text"
                value={newProgram.name}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, name: e.target.value })
                }
                placeholder="e.g., TB Clinic"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newProgram.description}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, description: e.target.value })
                }
                placeholder="e.g., Program for tuberculosis treatment and follow-up"
                rows="4"
              />
            </div>
            <button type="submit" className="submit-program-btn">
              CREATE PROGRAM
            </button>
          </form>
        )}

        <div className="programs-list">
          {programs.length === 0 ? (
            <p className="no-programs">No programs found.</p>
          ) : (
            programs.map((program) => (
              <div key={program.id} className="program-item">
                <div className="program-info">
                  <span className="program-name">{program.name}</span>
                  <p className="program-meta">
                    Created on {new Date(program.created_at).toLocaleDateString()} by {program.created_by}
                  </p>
                  {program.description && (
                    <p className="program-description">{program.description}</p>
                  )}
                </div>
                <div className="program-actions">
                  <Link to={`/programs/${program.id}/edit`} className="action-icon edit">
                    ✏️
                  </Link>
                  <span
                    className="action-icon delete"
                    onClick={() => handleDelete(program.id)}
                  >
                    🗑️
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Programs;