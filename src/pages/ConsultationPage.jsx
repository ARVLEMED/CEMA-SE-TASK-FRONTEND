import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../styles/ConsultationPage.css';

function Consultation() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [queuedClients, setQueuedClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [consultationData, setConsultationData] = useState({
    vitals: '',
    allergies: '',
    symptoms: '',
    medicalHistory: '',
    medications: '',
    diagnosis: '',
    investigations: '',
    treatmentPlan: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    fetchClients();
    fetchPrograms();
  }, [navigate]);

  const fetchClients = async () => {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/clients?status=waiting', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setQueuedClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message);
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
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError(error.message);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setConsultationData({
      vitals: '',
      allergies: '',
      symptoms: '',
      medicalHistory: '',
      medications: '',
      diagnosis: '',
      investigations: '',
      treatmentPlan: '',
    });
    setSelectedProgram('');
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    setConsultationData({
      ...consultationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const payload = {
        client_id: selectedClient.id,
        vitals: consultationData.vitals,
        allergies: consultationData.allergies,
        symptoms: consultationData.symptoms,
        medical_history: consultationData.medicalHistory,
        medications: consultationData.medications,
        diagnosis: consultationData.diagnosis,
        investigations: consultationData.investigations,
        treatment_plan: consultationData.treatmentPlan,
      };

      const response = await fetch('http://localhost:5000/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to save consultation');
      }

      setSuccess('Consultation saved successfully');
      setConsultationData({
        vitals: '',
        allergies: '',
        symptoms: '',
        medicalHistory: '',
        medications: '',
        diagnosis: '',
        investigations: '',
        treatmentPlan: '',
      });
    } catch (error) {
      console.error('Error saving consultation:', error);
      setError(error.message);
    }
  };

  const handleEnrollProgram = async () => {
    if (!selectedClient || !selectedProgram) {
      setError('Please select a client and a program');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ client_id: selectedClient.id, program_id: parseInt(selectedProgram) }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to enroll client');
      }
      setSuccess('Client enrolled in program successfully');
      setSelectedProgram('');
    } catch (error) {
      console.error('Error enrolling client:', error);
      setError(error.message);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: selectedClient.name, age: selectedClient.age, status: 'Active' }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark consultation as complete');
      }
      setQueuedClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
      setSelectedClient(null);
      setSuccess('Consultation marked as complete');
    } catch (error) {
      console.error('Error marking consultation complete:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <MainNavbar />
      <div className="main-content">
        {/* Client Queue Sidebar */}
        <div className="queue-sidebar">
          <h2 className="queue-title">Consultation Queue</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <ul className="queue-list">
            {queuedClients.length === 0 ? (
              <li className="no-clients">No clients in queue</li>
            ) : (
              queuedClients.map((client) => (
                <li
                  key={client.id}
                  className={`queue-item ${
                    selectedClient?.id === client.id ? 'active' : ''
                  }`}
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="client-info">
                    <span className="client-name">{client.name}</span>
                    <span className="client-age">Age: {client.age}</span>
                  </div>
                  <span className="client-status">{client.status}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Consultation Section */}
        <div className="consultation-section">
          {selectedClient ? (
            <form className="consultation-form" onSubmit={handleSaveConsultation}>
              <h2 className="form-title">
                Consultation for {selectedClient.name}
              </h2>

              {/* Static Client Details */}
              <div className="form-row">
                <div className="form-group">
                  <label>NAME</label>
                  <input
                    type="text"
                    value={selectedClient.name}
                    readOnly
                    className="input-readonly"
                  />
                </div>
                <div className="form-group">
                  <label>AGE</label>
                  <input
                    type="number"
                    value={selectedClient.age}
                    readOnly
                    className="input-readonly"
                  />
                </div>
              </div>

              {/* Consultation Form Fields */}
              {[
                { label: 'VITALS', name: 'vitals', placeholder: 'e.g., BP: 120/80, Temp: 36.5°C, HR: 72 bpm' },
                { label: 'ALLERGIES', name: 'allergies', placeholder: 'e.g., Penicillin, Peanuts' },
                { label: 'CURRENT SYMPTOMS', name: 'symptoms', placeholder: 'e.g., Cough, Fever, Fatigue' },
                { label: 'MEDICAL HISTORY', name: 'medicalHistory', placeholder: 'e.g., Hypertension, Diabetes' },
                { label: 'CURRENT MEDICATIONS', name: 'medications', placeholder: 'e.g., Lisinopril 10mg daily' },
                { label: 'DIAGNOSIS', name: 'diagnosis', placeholder: 'e.g., Extra-Pulmonary Tuberculosis' },
                { label: 'INVESTIGATIONS', name: 'investigations', placeholder: 'e.g., Chest X-ray, Sputum Culture' },
                { label: 'TREATMENT PLAN', name: 'treatmentPlan', placeholder: 'e.g., Medications, Follow-up schedule' },
              ].map((field) => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>
                  <textarea
                    name={field.name}
                    value={consultationData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="textarea-large"
                  />
                </div>
              ))}

              {/* Program Enrollment */}
              <div className="form-group">
                <label>ENROLL IN PROGRAM</label>
                <div className="program-selection">
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="program-select"
                  >
                    <option value="">Select a program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="add-to-program-btn"
                    onClick={handleEnrollProgram}
                  >
                    ADD TO PROGRAM
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  SAVE CONSULTATION
                </button>
                <button
                  type="button"
                  className="complete-btn"
                  onClick={handleMarkComplete}
                >
                  MARK AS COMPLETE
                </button>
              </div>
            </form>
          ) : (
            <div className="no-client-message">
              Select a client from the queue to start consultation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Consultation;