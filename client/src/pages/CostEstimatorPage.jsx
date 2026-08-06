import { useState, useEffect } from 'react';
import { estimateCost } from '../api/api.js';
import Toast from '../components/Toast.jsx';
import {
  MapPin, Activity, Building, IndianRupee, Calendar, Shield,
  RefreshCw, ShieldCheck, Info, Sparkles, Check, Calculator, Receipt,
  CheckCircle2, AlertTriangle, ArrowRight, Stethoscope, HeartPulse, Baby
} from 'lucide-react';
import './CostEstimatorPage.css';

const procedures = [
  'Appendectomy', 'Knee Replacement', 'Hip Replacement', 'Gallbladder Surgery',
  'Hernia Repair', 'Caesarean Delivery', 'Angioplasty', 'Cataract Surgery',
  'Heart Bypass', 'General Consultation', 'MRI Scan', 'CT Scan', 'ECG'
];

const popularProcedures = [
  { name: 'Appendectomy', icon: Activity },
  { name: 'Gallbladder Surgery', icon: Stethoscope },
  { name: 'Hernia Repair', icon: Activity },
  { name: 'Knee Replacement', icon: Activity },
  { name: 'Caesarean Delivery', icon: Baby },
  { name: 'Angioplasty', icon: HeartPulse }
];

const hospitalTypes = ['Standard', 'Premium', 'Luxury'];

const countries = [
  { name: 'India', currency: 'INR', flag: '🇮🇳' },
  { name: 'USA', currency: 'USD', flag: '🇺🇸' },
  { name: 'UK', currency: 'GBP', flag: '🇬🇧' },
  { name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { name: 'Australia', currency: 'AUD', flag: '🇦🇺' }
];

const currencies = ['INR', 'USD', 'GBP', 'CAD', 'AUD', 'EUR'];

function CostEstimatorPage() {
  const [form, setForm] = useState({
    country: 'India',
    state: '',
    procedure: procedures[0],
    hospitalType: hospitalTypes[0],
    sector: 'Private',
    currency: 'INR',
    age: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Auto-update currency when country changes
    if (name === 'country') {
      const selectedCountry = countries.find(c => c.name === value);
      if (selectedCountry) {
        setForm({ ...form, country: value, currency: selectedCountry.currency });
        return;
      }
    }
    
    setForm({ ...form, [name]: value });
  };

  const setProcedure = (name) => {
    setForm({ ...form, procedure: name });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setToast('');
    setResult(null);
    try {
      const response = await estimateCost(form);
      setResult(response.data);
      setToast('Cost estimate generated successfully.');
      setTimeout(() => {
        document.getElementById('estimation-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      setToast('Unable to estimate cost right now.');
    } finally {
      setLoading(false);
    }
  };

  const getCountryFlag = (countryName) => {
    const c = countries.find(c => c.name === countryName);
    return c ? c.flag : '🌐';
  };

  return (
    <div className="ce-page-container">
      <Toast message={toast} onClose={() => setToast('')} />

      {/* Hero Section */}
      <section className="ce-hero">
        <div className="ce-hero-content">
          <p className="ce-eyebrow">TREATMENT COST ESTIMATOR</p>
          <h1 className="ce-hero-title">Plan care with a clear pricing range.</h1>
          <p className="ce-hero-subtitle">
            Get an estimated cost for your treatment based on location, hospital type, and preferences.
          </p>
        </div>
        <div className="ce-hero-graphics" aria-hidden="true">
          {/* Aesthetic 3D-like glowing elements */}
          <div className="ce-graphic-shield"><Shield size={60} strokeWidth={1.5} color="#fff" /></div>
          <div className="ce-graphic-bill"><Receipt size={40} strokeWidth={1.5} color="#fff" /></div>
          <div className="ce-graphic-calc"><Calculator size={35} strokeWidth={1.5} color="#fff" /></div>
          <div className="ce-graphic-rupee"><IndianRupee size={25} strokeWidth={2} color="#fff" /></div>
        </div>
      </section>

      {/* Form Section */}
      <section className="ce-form-section">
        {/* Step Banner */}
        <div className="ce-steps-banner">
          <div className="ce-step active">
            <span className="ce-step-number">1</span>
            <div className="ce-step-text">
              <strong>Enter Details</strong>
              <span>Provide treatment information</span>
            </div>
          </div>
          <div className="ce-step">
            <span className="ce-step-number">2</span>
            <div className="ce-step-text">
              <strong>Estimate Cost</strong>
              <span>View pricing range</span>
            </div>
          </div>
          <div className="ce-step">
            <span className="ce-step-number">3</span>
            <div className="ce-step-text">
              <strong>Save & Compare</strong>
              <span>Save or compare options</span>
            </div>
          </div>
        </div>

        <form className="ce-main-form" onSubmit={handleSubmit}>
          <div className="ce-form-grid">
            <div className="ce-input-group">
              <label>Country</label>
              <div className="ce-input-wrapper">
                <span className="ce-flag-icon">{getCountryFlag(form.country)}</span>
                <select name="country" value={form.country} onChange={handleChange}>
                  {countries.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ce-input-group">
              <label>State / City</label>
              <div className="ce-input-wrapper">
                <MapPin className="ce-input-icon" size={18} />
                <input name="state" value={form.state} onChange={handleChange} placeholder="e.g., Karnataka, Bangalore" required />
                <MapPin className="ce-input-right-icon" size={16} />
              </div>
            </div>

            <div className="ce-input-group">
              <label>Treatment / Procedure</label>
              <div className="ce-input-wrapper">
                <Activity className="ce-input-icon" size={18} />
                <input 
                  name="procedure" 
                  value={form.procedure} 
                  onChange={handleChange} 
                  list="procedures-list" 
                  placeholder="Type or select a procedure"
                  required 
                />
                <datalist id="procedures-list">
                  {procedures.map((proc) => (
                    <option key={proc} value={proc} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="ce-input-group">
              <label>Hospital Sector</label>
              <div className="ce-pill-group">
                <button 
                  type="button" 
                  className={`ce-pill-btn ${form.sector === 'Private' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, sector: 'Private' })}
                >
                  Private
                </button>
                <button 
                  type="button" 
                  className={`ce-pill-btn ${form.sector === 'Public' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, sector: 'Public' })}
                >
                  Public (Govt)
                </button>
              </div>
            </div>

            <div className="ce-input-group">
              <label>Hospital Tier</label>
              <div className="ce-pill-group">
                {hospitalTypes.map((type) => (
                  <button 
                    key={type}
                    type="button" 
                    className={`ce-pill-btn ${form.hospitalType === type ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, hospitalType: type })}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="ce-input-group">
              <label>Currency</label>
              <div className="ce-input-wrapper">
                <IndianRupee className="ce-input-icon" size={18} />
                <select name="currency" value={form.currency} onChange={handleChange}>
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ce-input-group">
              <label>Patient Age (Optional)</label>
              <div className="ce-input-wrapper">
                <Calendar className="ce-input-icon" size={18} />
                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="e.g., 35" min="0" max="120" />
                <span className="ce-input-suffix">years</span>
              </div>
            </div>
          </div>

          <div className="ce-form-footer">
            <div className="ce-how-it-works">
              <Info className="ce-hiw-icon" size={18} />
              <div>
                <strong>How it works</strong>
                <p>We analyze average prices from verified hospitals and healthcare providers in your selected location.</p>
              </div>
            </div>
            <div className="ce-trust-badges">
              <div className="ce-badge">
                <CheckCircle2 size={16} className="ce-badge-icon" />
                <div>
                  <strong>Verified Data</strong>
                  <span>From trusted sources</span>
                </div>
              </div>
              <div className="ce-badge">
                <RefreshCw size={16} className="ce-badge-icon" />
                <div>
                  <strong>Updated Regularly</strong>
                  <span>Latest pricing info</span>
                </div>
              </div>
              <div className="ce-badge">
                <ShieldCheck size={16} className="ce-badge-icon" />
                <div>
                  <strong>Secure & Private</strong>
                  <span>Your data is safe</span>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="ce-submit-btn" disabled={loading}>
            {loading ? 'Estimating...' : 'Estimate treatment cost'} <ArrowRight size={18} />
          </button>
        </form>
      </section>

      {/* Result Section */}
      {result && (
        <section id="estimation-result" className="ce-result-section">
          <div className="ce-result-card">
            <div className="ce-result-header">
              <h2>{result.procedure} Estimate</h2>
              <span className="ce-location-badge"><MapPin size={14}/> {result.state}, {result.country}</span>
            </div>
            <div className="ce-result-pricing">
              <div className="ce-price-main">
                <span className="ce-price-label">Estimated Range</span>
                <span className="ce-price-value">{result.costRange}</span>
              </div>
              <div className="ce-price-breakdown">
                <div className="ce-breakdown-item">
                  <span>Hospital Stay</span>
                  <strong>{result.hospitalStay}</strong>
                </div>
                <div className="ce-breakdown-item">
                  <span>Medication</span>
                  <strong>{result.medicationCost}</strong>
                </div>
                <div className="ce-breakdown-item">
                  <span>Follow-up</span>
                  <strong>{result.followUpCost}</strong>
                </div>
              </div>
            </div>
            <div className="ce-result-footer">
              <Info size={16} />
              <p>{result.insuranceNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* Popular Procedures */}
      <section className="ce-popular-section">
        <h3 className="ce-section-title"><Sparkles size={18} /> Popular Procedures</h3>
        <div className="ce-popular-grid">
          {popularProcedures.map((proc) => {
            const Icon = proc.icon;
            const isSelected = form.procedure === proc.name;
            return (
              <button 
                key={proc.name} 
                type="button" 
                className={`ce-popular-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setProcedure(proc.name)}
              >
                <Icon size={16} className="ce-pop-icon" /> {proc.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom Info Panels */}
      <section className="ce-bottom-panels">
        <div className="ce-why-panel">
          <h3>Why use our cost estimator?</h3>
          <ul>
            <li><Check size={16} className="ce-check-icon" /> Compare costs across cities and hospitals</li>
            <li><Check size={16} className="ce-check-icon" /> Plan your healthcare budget in advance</li>
            <li><Check size={16} className="ce-check-icon" /> Get transparent pricing with no hidden charges</li>
            <li><Check size={16} className="ce-check-icon" /> Empower your decisions with accurate insights</li>
          </ul>
          <div className="ce-chart-graphic">
            {/* Simple CSS representation of the chart in the bottom right corner */}
            <div className="ce-bar ce-bar-1"></div>
            <div className="ce-bar ce-bar-2"></div>
            <div className="ce-bar ce-bar-3"></div>
            <div className="ce-bar ce-bar-4"></div>
            <svg viewBox="0 0 100 50" className="ce-trend-line" preserveAspectRatio="none">
              <path d="M0 40 Q 25 40, 50 20 T 100 5" fill="none" stroke="#60a5fa" strokeWidth="4" />
              <polygon points="90,5 100,5 100,15" fill="#60a5fa" />
            </svg>
          </div>
        </div>

        <div className="ce-disclaimer-panel">
          <h3><AlertTriangle size={18} className="ce-alert-icon" /> Disclaimer</h3>
          <p>
            The estimated cost is indicative and may vary based on hospital, doctor, tests,
            complications, and individual conditions.
          </p>
          <div className="ce-medical-advice-note">
            This is not a medical advice. Please consult a healthcare professional for more details.
          </div>
        </div>
      </section>
    </div>
  );
}

export default CostEstimatorPage;
