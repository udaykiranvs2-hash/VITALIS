import { useState, useEffect } from 'react';
import { submitSymptomCheck, fetchSymptomHistory } from '../api/api.js';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import { ArrowRight, ArrowLeft, ShieldCheck, Check, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
import '../styles/symptom-checker.css';

const initialForm = {
  age: '28',
  gender: 'female',
  duration: '3 days',
  severity: 'moderate',
  symptoms: '',
  medicalHistory: '',
  allergies: '',
  medications: '',
  activityLevel: 'Moderate',
  sleepHours: '7-9 hours',
  stressLevel: 'Moderate',
  lifestyleNotes: ''
};

function SymptomCheckerPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  
  const [viewMode, setViewMode] = useState('new'); // 'new' or 'history'
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (viewMode === 'history') {
      loadHistory();
    }
  }, [viewMode]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetchSymptomHistory();
      setHistoryList(res.data || []);
    } catch (err) {
      console.error(err);
      setToast('Failed to load history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const setSeverity = (severityValue) => {
    setForm({ ...form, severity: severityValue });
  };

  const setStress = (stressValue) => {
    setForm({ ...form, stressLevel: stressValue });
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setLoading(true);
    setToast('');
    try {
      const payload = {
        age: form.age,
        gender: form.gender,
        duration: form.duration,
        severity: form.severity,
        symptoms: form.symptoms ? form.symptoms.split(',').map((item) => item.trim()).filter(Boolean) : ['general malaise'],
        medicalHistory: form.medicalHistory ? form.medicalHistory.split(',').map((item) => item.trim()).filter(Boolean) : [],
        allergies: form.allergies ? form.allergies.split(',').map((item) => item.trim()).filter(Boolean) : [],
        medications: form.medications ? form.medications.split(',').map((item) => item.trim()).filter(Boolean) : [],
        lifestyle: {
          activityLevel: form.activityLevel,
          sleepHours: form.sleepHours,
          stressLevel: form.stressLevel,
          notes: form.lifestyleNotes
        }
      };
      const response = await submitSymptomCheck(payload);
      setResult(response.data);
      setToast('Symptom assessment completed successfully.');
    } catch (err) {
      console.error('Symptom Check Error:', err);
      const msg = err.response?.data?.message || err.message || 'Unknown error occurred.';
      setToast(`Unable to complete assessment: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep(1);
    setForm(initialForm);
  };

  // Calculating stepper progress line percentage
  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="symptom-checker-container">
      <div className="symptom-checker-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Symptom Checker</h1>
          <p>Tell us how you feel and we'll guide you.</p>
        </div>
        <div className="tab-switcher" style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface-strong)', padding: '0.35rem', borderRadius: '12px' }}>
          <button 
            type="button" 
            onClick={() => setViewMode('new')} 
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: viewMode === 'new' ? 'var(--primary)' : 'transparent', color: viewMode === 'new' ? '#fff' : 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
          >
            New Check
          </button>
          <button 
            type="button" 
            onClick={() => setViewMode('history')} 
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: viewMode === 'history' ? 'var(--primary)' : 'transparent', color: viewMode === 'history' ? '#fff' : 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
          >
            History
          </button>
        </div>
      </div>

      <Toast message={toast} type={result ? 'success' : 'info'} onClose={() => setToast('')} />

      {viewMode === 'history' ? (
        <div className="symptom-history-view">
          <h2 style={{ marginBottom: '1.5rem' }}>Past Assessments</h2>
          {loadingHistory ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><Loader label="Loading history..." /></div>
          ) : historyList.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: '16px' }}>No past assessments found.</p>
          ) : (
            <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {historyList.map((item) => (
                <div key={item.id} className="symptom-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.15rem' }}>{item.ai_assessment?.possibleConditions?.[0] || 'Assessment'}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--text)', fontSize: '0.95rem' }}>
                    <strong>Symptoms:</strong> {item.symptoms?.symptomsList}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.35rem 0.85rem', background: 'var(--surface-strong)', borderRadius: '20px', fontWeight: 500, border: item.severity_level === 'emergency' ? '1px solid var(--danger)' : '1px solid transparent' }}>
                      Severity: <strong style={{ color: item.severity_level === 'emergency' ? 'var(--danger)' : 'inherit' }}>{item.severity_level}</strong>
                    </span>
                    <span style={{ padding: '0.35rem 0.85rem', background: 'var(--surface-strong)', borderRadius: '20px', fontWeight: 500 }}>
                      Specialist: <strong>{item.ai_assessment?.suggestedSpecialist || 'General'}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {result ? (
            result.needsFollowUp ? (
            /* Needs Follow-Up View */
            <div className="symptom-card">
              <div className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 600 }}>More Information Needed</span>
                  <h2 style={{ margin: '0.2rem 0 0 0' }}>Clarification Required</h2>
                </div>
              </div>

              <div style={{ background: 'var(--surface-strong)', borderRadius: '16px', padding: '1.25rem', marginTop: '1rem' }}>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text)' }}>
                  To ensure clinical safety and provide a highly accurate assessment, our AI needs a bit more context about your symptoms.
                </p>
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem 0' }}>Please answer the following:</h3>
                <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', color: 'var(--text)', fontWeight: 500 }}>
                  {result.questions?.map((item, index) => (
                    <li key={index} style={{ marginBottom: '0.6rem' }}>{item}</li>
                  ))}
                </ul>
                
                <button 
                  type="button" 
                  onClick={() => {
                    setResult(null);
                    setStep(2); // Send them back to the symptoms step
                  }} 
                  className="step-next-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ArrowLeft size={18} /> Update Symptoms
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic', margin: '1.5rem 0 0 0' }}>
                * Disclaimer: {result.disclaimer || 'This AI tool provides educational health guidance and is not a substitute for professional medical diagnosis.'}
              </p>
            </div>
          ) : (
            /* Results View */
            <div className="symptom-card">
              <div className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 600 }}>Assessment Completed</span>
                  <h2 style={{ margin: '0.2rem 0 0 0' }}>Symptom Analysis Report</h2>
                </div>
                <button type="button" onClick={handleReset} className="step-back-btn">
                  <RotateCcw size={16} /> Start New Check
                </button>
              </div>

          {result.emergencyWarning ? (
            <div className="emergency-banner" style={{ background: 'rgba(218, 68, 83, 0.12)', border: '1px solid rgba(218, 68, 83, 0.3)', borderRadius: '16px', padding: '1.25rem', color: 'var(--danger)', display: 'flex', gap: '0.85rem' }}>
              <AlertTriangle size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '1.05rem' }}>{result.emergencyWarning.headline}</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.92rem' }}>{result.emergencyWarning.message}</p>
              </div>
            </div>
          ) : null}

          <div className="result-grid">
            <article>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.5rem 0' }}>POSSIBLE CONDITIONS</h3>
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                {result.possibleConditions?.map((condition, index) => (
                  <li key={index} style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{condition}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.5rem 0' }}>CONFIDENCE</h3>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)', margin: 0 }}>{result.confidence}</p>
            </article>
            <article>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.5rem 0' }}>SEVERITY LEVEL</h3>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', margin: 0, textTransform: 'capitalize' }}>{result.severityLevel || form.severity}</p>
            </article>
            <article>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.5rem 0' }}>SUGGESTED SPECIALIST</h3>
              <p style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>{result.suggestedSpecialist || 'General Physician'}</p>
            </article>
          </div>

          <div style={{ background: 'var(--surface-strong)', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem 0' }}>Recommended Next Steps</h3>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, color: 'var(--text)' }}>
              {result.nextSteps?.map((item, index) => (
                <li key={index} style={{ marginBottom: '0.4rem' }}>{item}</li>
              ))}
            </ul>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>
            * Disclaimer: {result.disclaimer || 'This AI tool provides educational health guidance and is not a substitute for professional medical diagnosis.'}
          </p>
            </div>
            )
          ) : (
        /* Multi-step Form Wizard */
        <div className="symptom-checker-grid">
          {/* Left Column: Form & Stepper Card */}
          <div className="symptom-card">
            {/* Stepper Header */}
            <div className="stepper-container">
              <div className="stepper-line-bg" />
              <div className="stepper-line-progress" style={{ width: `${progressPercent}%` }} />

              <button type="button" onClick={() => setStep(1)} className={`stepper-step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                <div className="step-circle">{step > 1 ? <Check size={18} /> : '1'}</div>
                <span className="step-label">Basic Info</span>
              </button>

              <button type="button" onClick={() => step > 1 && setStep(2)} className={`stepper-step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                <div className="step-circle">{step > 2 ? <Check size={18} /> : '2'}</div>
                <span className="step-label">Symptoms</span>
              </button>

              <button type="button" onClick={() => step > 2 && setStep(3)} className={`stepper-step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
                <div className="step-circle">{step > 3 ? <Check size={18} /> : '3'}</div>
                <span className="step-label">Lifestyle</span>
              </button>

              <button type="button" onClick={() => step > 3 && setStep(4)} className={`stepper-step ${step === 4 ? 'active' : ''}`}>
                <div className="step-circle">4</div>
                <span className="step-label">Review</span>
              </button>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <form onSubmit={handleNext} className="step-form-grid">
                <div className="form-field">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    placeholder="e.g. 28"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="duration">Duration of symptoms</label>
                  <select id="duration" name="duration" value={form.duration} onChange={handleChange}>
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="3 days">3 days</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="3-7 days">3-7 days</option>
                    <option value="More than a week">More than a week</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Severity</label>
                  <div className="severity-pills">
                    <button
                      type="button"
                      className={`severity-pill ${form.severity === 'mild' ? 'selected' : ''}`}
                      onClick={() => setSeverity('mild')}
                    >
                      Mild
                    </button>
                    <button
                      type="button"
                      className={`severity-pill ${form.severity === 'moderate' ? 'selected' : ''}`}
                      onClick={() => setSeverity('moderate')}
                    >
                      Moderate
                    </button>
                    <button
                      type="button"
                      className={`severity-pill ${form.severity === 'severe' ? 'selected' : ''}`}
                      onClick={() => setSeverity('severe')}
                    >
                      Severe
                    </button>
                  </div>
                </div>

                <div className="form-group-full step-actions">
                  <button type="submit" className="step-next-btn">
                    Next: Describe Symptoms <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Symptoms & Medical History */}
            {step === 2 && (
              <form onSubmit={handleNext} className="step-form-grid">
                <div className="form-field form-group-full">
                  <label htmlFor="symptoms">Describe Symptoms</label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={form.symptoms}
                    onChange={handleChange}
                    placeholder="Describe how you feel (e.g. fever, headache, persistent cough, fatigue)"
                    rows={4}
                    required
                  />
                </div>

                <div className="form-field form-group-full">
                  <label htmlFor="medicalHistory">Medical History (Optional)</label>
                  <input
                    id="medicalHistory"
                    name="medicalHistory"
                    value={form.medicalHistory}
                    onChange={handleChange}
                    placeholder="Pre-existing conditions e.g. asthma, diabetes, hypertension"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="allergies">Allergies (Optional)</label>
                  <input
                    id="allergies"
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="Known allergies e.g. penicillin, dust"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="medications">Current Medications (Optional)</label>
                  <input
                    id="medications"
                    name="medications"
                    value={form.medications}
                    onChange={handleChange}
                    placeholder="Current medicines e.g. paracetamol"
                  />
                </div>

                <div className="form-group-full step-actions">
                  <button type="button" onClick={handleBack} className="step-back-btn">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" className="step-next-btn" style={{ flex: 1 }}>
                    Next: Lifestyle & Context <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Lifestyle & Context */}
            {step === 3 && (
              <form onSubmit={handleNext} className="step-form-grid">
                <div className="form-field">
                  <label htmlFor="activityLevel">Daily Activity Level</label>
                  <select id="activityLevel" name="activityLevel" value={form.activityLevel} onChange={handleChange}>
                    <option value="Sedentary">Sedentary (Little to no exercise)</option>
                    <option value="Moderate">Moderate (Light physical activity)</option>
                    <option value="Active">Active (Regular exercise)</option>
                    <option value="Very Active">Very Active (Intense training)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="sleepHours">Average Sleep Duration</label>
                  <select id="sleepHours" name="sleepHours" value={form.sleepHours} onChange={handleChange}>
                    <option value="Less than 5 hours">Less than 5 hours</option>
                    <option value="5-7 hours">5-7 hours</option>
                    <option value="7-9 hours">7-9 hours</option>
                    <option value="9+ hours">9+ hours</option>
                  </select>
                </div>

                <div className="form-field form-group-full">
                  <label>Recent Stress Level</label>
                  <div className="severity-pills">
                    <button
                      type="button"
                      className={`severity-pill ${form.stressLevel === 'Low' ? 'selected' : ''}`}
                      onClick={() => setStress('Low')}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      className={`severity-pill ${form.stressLevel === 'Moderate' ? 'selected' : ''}`}
                      onClick={() => setStress('Moderate')}
                    >
                      Moderate
                    </button>
                    <button
                      type="button"
                      className={`severity-pill ${form.stressLevel === 'High' ? 'selected' : ''}`}
                      onClick={() => setStress('High')}
                    >
                      High
                    </button>
                  </div>
                </div>

                <div className="form-field form-group-full">
                  <label htmlFor="lifestyleNotes">Additional Notes (Optional)</label>
                  <textarea
                    id="lifestyleNotes"
                    name="lifestyleNotes"
                    value={form.lifestyleNotes}
                    onChange={handleChange}
                    placeholder="Dietary changes, recent travel, or environmental changes..."
                    rows={3}
                  />
                </div>

                <div className="form-group-full step-actions">
                  <button type="button" onClick={handleBack} className="step-back-btn">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" className="step-next-btn" style={{ flex: 1 }}>
                    Next: Review & Confirm <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="step-form-grid">
                <div className="form-group-full review-summary-box">
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--text)' }}>Summary Review</h3>

                  <div className="review-item">
                    <span className="review-item-label">Age & Gender</span>
                    <span className="review-item-value">{form.age} years old · {form.gender}</span>
                  </div>

                  <div className="review-item">
                    <span className="review-item-label">Duration & Severity</span>
                    <span className="review-item-value">{form.duration} · {form.severity} severity</span>
                  </div>

                  <div className="review-item">
                    <span className="review-item-label">Primary Symptoms</span>
                    <span className="review-item-value">{form.symptoms || 'General discomfort'}</span>
                  </div>

                  {form.medicalHistory && (
                    <div className="review-item">
                      <span className="review-item-label">Medical History</span>
                      <span className="review-item-value">{form.medicalHistory}</span>
                    </div>
                  )}

                  <div className="review-item">
                    <span className="review-item-label">Lifestyle Context</span>
                    <span className="review-item-value">{form.activityLevel} activity · {form.stressLevel} stress</span>
                  </div>
                </div>

                <div className="form-group-full step-actions">
                  <button type="button" onClick={handleBack} className="step-back-btn">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={handleSubmit} disabled={loading} className="step-next-btn" style={{ flex: 1 }}>
                    {loading ? <Loader label="Analyzing symptoms…" /> : <><Sparkles size={18} /> Analyze Symptoms</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Illustration & Privacy Box */}
          <div className="checker-side-panel">
            <div className="illustration-card">
              <div className="illustration-graphics">
                {/* SVG Character Illustration matching UI mockup */}
                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="120" cy="120" r="100" fill="#EBF3FF" />
                  <circle cx="50" cy="65" r="16" fill="#D0E2FF" opacity="0.6" />
                  <text x="46" y="71" fontSize="18" fontWeight="bold" fill="#0863CE">?</text>

                  <circle cx="190" cy="80" r="22" fill="#D0E2FF" opacity="0.8" />
                  <text x="183" y="88" fontSize="22" fontWeight="bold" fill="#0863CE">?</text>

                  <circle cx="170" cy="170" r="14" fill="#D0E2FF" opacity="0.5" />
                  <text x="166" y="175" fontSize="14" fontWeight="bold" fill="#0863CE">?</text>

                  {/* Female Thoughtful Character Vector */}
                  <path d="M120 185C148 185 170 162 170 134C170 106 148 83 120 83C92 83 70 106 70 134C70 162 92 185 120 185Z" fill="#2563EB" opacity="0.15" />
                  
                  {/* Hair */}
                  <path d="M85 105C85 80 100 65 120 65C140 65 155 80 155 105C155 125 150 145 150 145H90C90 145 85 125 85 105Z" fill="#1E293B" />
                  
                  {/* Body/Shirt */}
                  <path d="M80 200C80 165 95 150 120 150C145 150 160 165 160 200V220H80V200Z" fill="#2563EB" />
                  
                  {/* Face */}
                  <circle cx="120" cy="115" r="26" fill="#FDBA74" />
                  <path d="M110 105C110 105 115 102 120 105" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                  <path d="M125 105C125 105 130 102 135 105" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="114" cy="112" r="2.5" fill="#334155" />
                  <circle cx="128" cy="112" r="2.5" fill="#334155" />
                  <path d="M117 125C120 127 124 127 127 125" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />

                  {/* Thinking Arm / Hand to chin */}
                  <path d="M140 180L132 135L125 128" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Privacy Matters Card */}
            <div className="privacy-card">
              <div className="privacy-icon">
                <ShieldCheck size={22} />
              </div>
              <div className="privacy-content">
                <h4>Your privacy matters</h4>
                <p>All your data is secure and confidential.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}

export default SymptomCheckerPage;
