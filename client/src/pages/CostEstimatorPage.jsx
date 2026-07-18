import { useState } from 'react';
import { estimateCost } from '../api/api.js';
import Toast from '../components/Toast.jsx';

const procedures = ['Appendectomy', 'Knee Replacement', 'Hip Replacement', 'Gallbladder Removal', 'Cataract Surgery', 'Heart Bypass', 'General Consultation', 'MRI Scan', 'CT Scan', 'ECG'];
const hospitalTypes = ['Standard', 'Premium', 'Luxury'];

function CostEstimatorPage() {
  const [form, setForm] = useState({ country: 'India', state: '', procedure: procedures[0], hospitalType: hospitalTypes[0], currency: 'INR' });
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
            State / City
            <input name="state" value={form.state} onChange={handleChange} placeholder="e.g., Karnataka, Bangalore" required />
          </label>
          <label>
            Treatment
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
          <label>
            Currency
            <input name="currency" value={form.currency} readOnly />
          </label>
        </div>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Estimating…' : 'Estimate treatment cost'}
        </button>
      </form>
      {result ? (
        <section className="result-panel">
          <div className="result-header">
            <h2>Estimated treatment cost</h2>
            <p className="eyebrow">{result.procedure} • {result.hospitalStay}</p>
          </div>
          <div className="result-grid">
            <article>
              <h3>Estimated (INR)</h3>
              <p className="price">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(result.estimatedInr)}</p>
              <small>Typical range: {result.costRange}</small>
            </article>
            <article>
              <h3>Medication</h3>
              <p>{result.medicationCost}</p>
            </article>
            <article>
              <h3>Follow-up</h3>
              <p>{result.followUpCost}</p>
            </article>
            <article>
              <h3>Notes</h3>
              <p>{result.insuranceNote}</p>
            </article>
          </div>
          <small>{result.disclaimer}</small>
        </section>
      ) : null}
    </div>
  );
}

export default CostEstimatorPage;
