import { useState } from 'react';
import { submitSymptomCheck } from '../api/api.js';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';

const initialForm = {
  age: '',
  gender: 'female',
  symptoms: '',
  duration: '1-3 days',
  severity: 'mild',
  medicalHistory: '',
  allergies: '',
  medications: ''
};

function SymptomCheckerPage() {
  const [form, setForm] = useState(initialForm);
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
      const payload = {
        ...form,
        symptoms: form.symptoms.split(',').map((item) => item.trim()).filter(Boolean),
        medicalHistory: form.medicalHistory.split(',').map((item) => item.trim()).filter(Boolean),
        allergies: form.allergies.split(',').map((item) => item.trim()).filter(Boolean),
        medications: form.medications.split(',').map((item) => item.trim()).filter(Boolean)
      };
      const response = await submitSymptomCheck(payload);
      setResult(response.data);
      setToast('Symptom assessment completed. Review the guidance below.');
    } catch {
      setToast('Unable to complete symptom assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Symptom Checker</p>
          <h1>Describe how you feel.</h1>
        </div>
      </div>
      <Toast message={toast} type={result ? 'success' : 'info'} onClose={() => setToast('')} />
      <form className="feature-form" onSubmit={handleSubmit} aria-label="Symptom checker form">
        <div className="form-grid">
          <label>
            Age
            <input name="age" type="number" value={form.age} onChange={handleChange} min="1" max="120" required />
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="full-width">
            Symptoms
            <textarea name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="e.g. fever, cough, headache" required />
          </label>
          <label>
            Duration
            <select name="duration" value={form.duration} onChange={handleChange}>
              <option>Less than 24 hours</option>
              <option>1-3 days</option>
              <option>3-7 days</option>
              <option>More than a week</option>
            </select>
          </label>
          <label>
            Severity
            <select name="severity" value={form.severity} onChange={handleChange}>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </label>
          <label className="full-width">
            Medical history
            <input name="medicalHistory" value={form.medicalHistory} onChange={handleChange} placeholder="Comma-separated conditions" />
          </label>
          <label className="full-width">
            Allergies
            <input name="allergies" value={form.allergies} onChange={handleChange} placeholder="Comma-separated allergies" />
          </label>
          <label className="full-width">
            Current medications
            <input name="medications" value={form.medications} onChange={handleChange} placeholder="Comma-separated medications" />
          </label>
        </div>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Checking…' : 'Analyze symptoms'}
        </button>
      </form>

      {result ? (
        <section className="result-panel">
          <div className="result-header">
            <h2>Assessment result</h2>
            <span>{result.disclaimer}</span>
          </div>
          {result.emergencyWarning ? (
            <div className="emergency-banner">
              <strong>{result.emergencyWarning.headline}</strong>
              <p>{result.emergencyWarning.message}</p>
            </div>
          ) : null}
          <div className="result-grid">
            <article>
              <h3>Possible conditions</h3>
              <ul>{result.possibleConditions.map((condition, index) => <li key={index}>{condition}</li>)}</ul>
            </article>
            <article>
              <h3>Confidence</h3>
              <p>{result.confidence}</p>
              <h3>Severity</h3>
              <p>{result.severityLevel}</p>
            </article>
            <article>
              <h3>Suggested specialist</h3>
              <p>{result.suggestedSpecialist}</p>
            </article>
          </div>
          <div>
            <h3>Next steps</h3>
            <ul>{result.nextSteps.map((item, index) => <li key={index}>{item}</li>)}</ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default SymptomCheckerPage;
