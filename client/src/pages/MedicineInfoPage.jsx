import { useState } from 'react';
import { searchMedicine } from '../api/api.js';
import Loader from '../components/Loader.jsx';

function MedicineInfoPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await searchMedicine(query);
      setResults(response.data.medicines);
    } catch {
      setError('Unable to find medicine information at the moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Medicine information</p>
          <h1>Search drug guidance, warnings and interactions.</h1>
        </div>
      </div>
      <form className="feature-form" onSubmit={handleSubmit} aria-label="Medicine search form">
        <div className="form-grid">
          <label className="full-width">
            Search medicine
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Paracetamol" required />
          </label>
        </div>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="form-message error">{error}</p>}
      {loading ? (
        <Loader label="Searching medicines…" />
      ) : results.length ? (
        <div className="medicine-list">
          {results.map((medicine) => (
            <article key={medicine.id} className="medicine-card">
              <h3>{medicine.name}</h3>
              <p><strong>Uses:</strong> {medicine.uses}</p>
              <p><strong>Dosage:</strong> {medicine.dosage}</p>
              <p><strong>Warnings:</strong> {medicine.warnings}</p>
              <p><strong>Side effects:</strong> {medicine.sideEffects}</p>
              <p><strong>Interactions:</strong> {medicine.interactions}</p>
              <p><strong>Storage:</strong> {medicine.storage}</p>
            </article>
          ))}
        </div>
      ) : query ? (
        <p className="empty-state">No medicine information found for this search.</p>
      ) : (
        <p className="empty-state">Start with a medication name to review details.</p>
      )}
    </div>
  );
}

export default MedicineInfoPage;
