import { useState } from 'react';
import { analyzeReport } from '../api/api.js';
import Toast from '../components/Toast.jsx';

function ReportAnalyzerPage() {
  const [reportType, setReportType] = useState('Blood Test');
  const [reportName, setReportName] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    setFile(selected || null);
    if (selected) {
      setReportName(selected.name);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setToast('Please upload a PDF, JPG, or PNG report.');
      return;
    }
    setLoading(true);
    setToast('');

    try {
      const payload = {
        reportType,
        reportName,
        fileName: file.name,
        fileText: file.name
      };
      const response = await analyzeReport(payload);
      setResult(response.data);
      setToast('Report analysis is ready.');
    } catch {
      setToast('Unable to analyze the report right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Medical report analyzer</p>
          <h1>Upload a report and get a smart summary.</h1>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <form className="feature-form" onSubmit={handleSubmit} aria-label="Report analyzer form">
        <div className="form-grid">
          <label>
            Report type
            <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
              <option>Blood Test</option>
              <option>CBC</option>
              <option>Thyroid</option>
              <option>Kidney</option>
              <option>Liver</option>
              <option>ECG</option>
              <option>MRI</option>
              <option>CT Scan</option>
              <option>Other lab report</option>
            </select>
          </label>
          <label className="full-width">
            Report file
            <input type="file" accept=".pdf,image/png,image/jpeg" onChange={handleFileChange} />
          </label>
          <label className="full-width">
            Notes (optional)
            <textarea value={reportName} onChange={(event) => setReportName(event.target.value)} placeholder="Name or brief details" />
          </label>
        </div>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze report'}
        </button>
      </form>

      {result ? (
        <section className="result-panel">
          <div className="result-header">
            <h2>{result.title}</h2>
            <span>{result.disclaimer}</span>
          </div>
          <p className="result-summary">{result.summary}</p>
          <div className="result-grid">
            <article>
              <h3>Key findings</h3>
              <ul>{result.findings.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </article>
            <article>
              <h3>Important values</h3>
              {result.abnormalValues.length ? (
                <ul>{result.abnormalValues.map((item, index) => <li key={index}>{item}</li>)}</ul>
              ) : (
                <p>No abnormal markers detected.</p>
              )}
            </article>
          </div>
          <div>
            <h3>Recommendations</h3>
            <ul>{result.recommendations.map((item, index) => <li key={index}>{item}</li>)}</ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ReportAnalyzerPage;
