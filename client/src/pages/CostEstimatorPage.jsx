import { useState } from 'react';
import { estimateCost } from '../api/api.js';
import Toast from '../components/Toast.jsx';

const procedures = ['Appendectomy', 'Knee Replacement', 'Hip Replacement', 'Gallbladder Removal', 'Cataract Surgery', 'Heart Bypass', 'General Consultation', 'MRI Scan', 'CT Scan', 'ECG'];
const hospitalTypes = ['Standard', 'Premium', 'Luxury'];

function CostEstimatorPage() {
  const [form, setForm] = useState({ country: '', state: '', procedure: procedures[0], hospitalType: hospitalTypes[0] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setToast('');
    try {
      const response = await estimateCost(form);
      setResult(response.data);
      setToast('Cost estimate generated.');
    } catch {
      setToast('Unable to estimate cost right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Treatment cost estimator</p>
          <h1>Plan care with a clear pricing range.</h1>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <form className="feature-form" onSubmit={handleSubmit} aria-label="Cost estimator form">
        <div className="form-grid">
          <label>
            Country
            <input name="country" value={form.country} onChange={handleChange} required />
          </label>
          <label>
            State
            <input name="state" value={form.state} onChange={handleChange} required />
          </label>
          <label>
            Procedure
            <select name="procedure" value={form.procedure} onChange={handleChange}>
              {procedures.map((procedure) => (
                <option key={procedure} value={procedure}>{procedure}</option>
              ))}
            </select>
          </label>
          <label>
            Hospital type
            <select name="hospitalType" value={form.hospitalType} onChange={handleChange}>
              {hospitalTypes.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Estimating…' : 'Estimate cost'}
        </button>
      </form>
      {result ? (
        <section className="result-panel">
          <div className="result-header">
            <h2>Estimated cost</h2>
          </div>
          <div className="result-grid">
            <article>
              <h3>Cost range</h3>
              <p>{result.costRange}</p>
            </article>
            <article>
              <h3>Hospital stay</h3>
              <p>{result.hospitalStay}</p>
            </article>
            <article>
              <h3>Medication cost</h3>
              <p>{result.medicationCost}</p>
            </article>
            <article>
              <h3>Follow-up cost</h3>
              <p>{result.followUpCost}</p>
            </article>
          </div>
          <p>{result.insuranceNote}</p>
          <small>{result.disclaimer}</small>
        </section>
      ) : null}
    </div>
  );
}

export default CostEstimatorPage;
