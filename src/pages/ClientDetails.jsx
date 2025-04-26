import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../styles/ClientDetail.css';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token || token.split('.').length !== 3) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      try {
        // Fetch client
        const clientResponse = await fetch(`https://cema-se-task-backend.onrender.com/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientResponse.ok) {
          if (clientResponse.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch client');
        }
        const clientData = await clientResponse.json();
        setClient(clientData);

        // Fetch consultations
        const consultationsResponse = await fetch(`https://cema-se-task-backend.onrender.com/api/consultations?client_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!consultationsResponse.ok) throw new Error('Failed to fetch consultations');
        const consultationsData = await consultationsResponse.json();
        setConsultations(consultationsData);

        // Fetch all programs
        const programsResponse = await fetch('https://cema-se-task-backend.onrender.com/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!programsResponse.ok) throw new Error('Failed to fetch programs');
        const programsData = await programsResponse.json();

        // Map enrollments to program names
        const enrolledPrograms = clientData.enrollments
          .map((enrollmentId) => {
            const enrollment = clientData.enrollments_data?.find((e) => e.id === enrollmentId);
            if (!enrollment) return null;
            const program = programsData.find((p) => p.id === enrollment.program_id);
            return program ? program.name : null;
          })
          .filter((name) => name);
        setPrograms(enrolledPrograms);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="client-detail-container">
      <MainNavbar />
      <div className="client-detail-card">
        <h2>Client Details</h2>
        {error && <p className="error-message">{error}</p>}
        {client ? (
          <>
            <div className="client-info">
              <p><strong>Name:</strong> {client.name}</p>
              <p><strong>Age:</strong> {client.age}</p>
              <p><strong>Status:</strong> {client.status}</p>
              <p><strong>Created At:</strong> {new Date(client.created_at).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(client.updated_at).toLocaleString()}</p>
            </div>

            <div className="client-section">
              <h3>Enrollments</h3>
              {programs.length === 0 ? (
                <p>No enrollments found.</p>
              ) : (
                <ul>
                  {programs.map((programName, index) => (
                    <li key={index}>{programName}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="client-section">
              <h3>Consultations</h3>
              {consultations.length === 0 ? (
                <p>No consultations found.</p>
              ) : (
                consultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <p><strong>Symptoms:</strong> {consultation.symptoms || 'N/A'}</p>
                    <p><strong>Diagnosis:</strong> {consultation.diagnosis || 'N/A'}</p>
                    <p><strong>Vitals:</strong> {consultation.vitals || 'N/A'}</p>
                    <p><strong>Treatment Plan:</strong> {consultation.treatment_plan || 'N/A'}</p>
                    <p><strong>Created:</strong> {new Date(consultation.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="client-actions">
              <button onClick={() => navigate('/clients')}>Back to Clients</button>
              <Link to={`/clients/${id}/edit`} className="edit-btn">Edit Client</Link>
            </div>
          </>
        ) : (
          <p>Client not found.</p>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;