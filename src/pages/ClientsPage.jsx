import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../styles/ClientsPage.css';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [programs, setPrograms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchClients();
    fetchPrograms();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://cema-se-task-backend.onrender.com/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const fetchClients = async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(`https://cema-se-task-backend.onrender.com/api/clients?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message);
    }
  };

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://cema-se-task-backend.onrender.com/api/programs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
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

  const getProgramNames = (enrollments) => {
    if (!enrollments || !programs.length) return 'None';
    const programNames = enrollments
      .map((enrollment) => {
        const program = programs.find((p) => p.id === enrollment.program_id);
        return program ? program.name : null;
      })
      .filter((name) => name);
    return programNames.length ? programNames.join(', ') : 'None';
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchClients(term);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(`https://cema-se-task-backend.onrender.com/api/clients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        throw new Error('Failed to delete client');
      }
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <MainNavbar />
      <div className="clients-section">
        <div className="clients-header">
          <h2>CLIENTS LIST</h2>
          {user && <p className="welcome-message">Welcome, {user.email}</p>}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/register" className="add-client-btn">
            ADD CLIENT
          </Link>
        </div>

        <div className="clients-list">
          {clients.length === 0 ? (
            <p className="no-clients">No clients found.</p>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="client-item">
                <div className="client-info">
                  <div className="client-initials">
                    {client.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="client-name">{client.name}</span>
                  <span className="client-details">
                    Age: {client.age} | Status: {client.status} | 
                    Consultations: {client.consultations.length} | 
                    Enrollments: {client.enrollments.length} | 
                    Programs: {getProgramNames(client.enrollments_data)}
                  </span>
                </div>
                <div className="client-actions">
                  <Link to={`/clients/${client.id}/edit`} className="action-icon edit">
                    ✏️
                  </Link>
                  <span
                    className="action-icon delete"
                    onClick={() => handleDelete(client.id)}
                  >
                    🗑️
                  </span>
                  <Link to={`/clients/${client.id}`} className="action-icon view">
                    👁️
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;