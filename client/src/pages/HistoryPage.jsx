import { useEffect, useState } from 'react';
import { fetchHistory } from '../api/api.js';
import Loader from '../components/Loader.jsx';

function HistoryPage() {
  const [history, setHistory] = useState({ reports: [], appointments: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const response = await fetchHistory();
        setHistory(response.data);
      } catch {
        setError('Unable to load health history.');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Health history</p>
          <h1>Track records, appointments and summaries.</h1>
        </div>
      </div>
      {loading ? (
        <Loader label="Loading health history…" />
      ) : error ? (
        <p className="form-message error">{error}</p>
      ) : (
        <div className="timeline-grid">
          <section>
            <h2>Recent reports</h2>
            {history.reports.length ? (
              <ul className="timeline-list">
                {history.reports.map((report) => (
                  <li key={report._id || report.uploadedAt}>
                    <strong>{report.title}</strong>
                    <p>{report.summary}</p>
                    <span>{new Date(report.uploadedAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No uploaded reports yet.</p>
            )}
          </section>

          <section>
            <h2>Appointments</h2>
            {history.appointments.length ? (
              <ul className="timeline-list">
                {history.appointments.map((appointment) => (
                  <li key={appointment._id || appointment.date + appointment.time}>
                    <strong>{appointment.doctorName}</strong>
                    <p>{appointment.specialty}</p>
                    <span>{appointment.date} • {appointment.time} • {appointment.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No appointments scheduled yet.</p>
            )}
          </section>

          <section>
            <h2>Symptom checks</h2>
            {history.history.length ? (
              <ul className="timeline-list">
                {history.history.map((item) => (
                  <li key={item._id || item.checkedAt}>
                    <strong>{item.result?.possibleConditions?.join(', ') || 'Symptom check'}</strong>
                    <p>Severity: {item.severity}, Duration: {item.duration}</p>
                    <span>{new Date(item.checkedAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No symptom checks recorded yet.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
