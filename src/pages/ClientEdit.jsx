import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../styles/ClientEdit.css';

const ClientEdit = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [status, setStatus] = useState('Waiting');
  const [client, setClient] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      const token = localStorage.getItem('token');
      if (!token || token.split('.').length !== 3) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch client');
        }
        const data = await response.json();
        setClient(data);
        setName(data.name);
        setAge(data.age.toString());
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchPrograms = async () => {
      const token = localStorage.getItem('token');
      if (!token || token.split('.').length !== 3) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/programs', {
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

    fetchClient();
    fetchPrograms();
  }, [id, navigate]);

  const getProgramName = (programId) => {
    const program = programs.find((p) => p.id === programId);
    return program ? program.name : 'Unknown Program';
  };

  const handleProgramChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setSelectedPrograms(selected);
  };

  const handleEnrollPrograms = async () => {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    if (!selectedPrograms.length) {
      setError('Please select at least one program to enroll the client');
      return;
    }

    setLoading(true);
    try {
      for (const programId of selectedPrograms) {
        const response = await fetch('http://localhost:5000/api/enrollments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ client_id: parseInt(id), program_id: programId }),
        });
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(data.message || 'Failed to enroll client');
        }
      }

      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setClient(data);
      setSuccess('Client enrolled in selected programs successfully');
      setSelectedPrograms([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      console.log(`Attempting to unenroll with enrollmentId: ${enrollmentId}`); // Debugging
      const response = await fetch(`http://localhost:5000/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('DELETE response:', response); // Debugging
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error(data.message || 'Failed to unenroll client');
      }

      const clientResponse = await fetch(`http://localhost:5000/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const clientData = await clientResponse.json();
      setClient(clientData);
      setSuccess('Client unenrolled successfully');
    } catch (err) {
      console.error('Unenroll error:', err); // Debugging
      setError(err.message || 'Failed to unenroll client due to a network error');
    } finally {
      setLoading(false);
    }
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
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, age: parseInt(age), status }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to update client');
      }

      setSuccess('Client updated successfully!');
      setTimeout(() => navigate('/clients'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return (
      <div className="client-edit-container">
        <MainNavbar />
        <div className="client-edit-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-edit-container">
      <MainNavbar />
      <div className="client-edit-card">
        <h2>Edit Client</h2>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Client'}
          </button>
        </form>

        <div className="enrollment-section">
          <h3>Current Enrollments</h3>
          {client.enrollments_data && client.enrollments_data.length > 0 ? (
            <ul className="enrollment-list">
              {client.enrollments_data.map((enrollment) => (
                <li key={enrollment.id} className="enrollment-item">
                  <span>{getProgramName(enrollment.program_id)}</span>
                  <button
                    onClick={() => handleUnenroll(enrollment.id)}
                    className="unenroll-btn"
                    disabled={loading}
                  >
                    Unenroll
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No programs enrolled.</p>
          )}

          <h3>Enroll in New Programs</h3>
          <div className="enroll-form">
            <select
              multiple
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
            <button
              onClick={handleEnrollPrograms}
              className="enroll-btn"
              disabled={loading}
            >
              {loading ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </div>

        <button className="cancel-btn" onClick={() => navigate('/clients')} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ClientEdit;