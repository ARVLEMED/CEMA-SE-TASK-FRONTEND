import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../styles/ClientEdit.css'; // Reuse ClientEdit.css for consistent styling

const RegisterClient = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [status, setStatus] = useState('Waiting');
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch programs on mount
  useEffect(() => {
    const fetchPrograms = async () => {
      const token = localStorage.getItem('token');
      if (!token || token.split('.').length !== 3) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://cema-se-task-backend.onrender.com/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
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
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPrograms();
  }, [navigate]);

  const handleProgramChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setSelectedPrograms(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (age <= 0) {
      setError('Age must be a positive number');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      // Step 1: Create the client
      const clientResponse = await fetch('https://cema-se-task-backend.onrender.com/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, age: parseInt(age), status }),
      });

      if (!clientResponse.ok) {
        if (clientResponse.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await clientResponse.json();
        throw new Error(data.message || 'Failed to create client');
      }

      const clientData = await clientResponse.json();
      const clientId = clientData.id;

      // Step 2: Enroll the client in selected programs (if any)
      if (selectedPrograms.length > 0) {
        for (const programId of selectedPrograms) {
          const enrollResponse = await fetch('https://cema-se-task-backend.onrender.com/api/enrollments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ client_id: clientId, program_id: programId }),
          });
          const enrollData = await enrollResponse.json();
          if (!enrollResponse.ok) {
            if (enrollResponse.status === 401) {
              localStorage.removeItem('token');
              navigate('/login');
              return;
            }
            throw new Error(enrollData.message || 'Failed to enroll client');
          }
        }
      }

      setSuccess('Client created successfully' + (selectedPrograms.length > 0 ? ' and enrolled in selected programs!' : '!'));
      setTimeout(() => navigate('/clients'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-edit-container">
      <MainNavbar />
      <div className="client-edit-card">
        <h2>Add Client</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
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
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="Waiting">Waiting</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="programs">Enroll in Programs</label>
            <select
              multiple
              id="programs"
              value={selectedPrograms}
              onChange={handleProgramChange}
              className="program-select"
              disabled={loading}
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Client'}
          </button>
        </form>
        <button className="cancel-btn" onClick={() => navigate('/clients')} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegisterClient;