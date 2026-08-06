import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Activity,
  Apple,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FileUp,
  ListChecks,
  LoaderCircle,
  Salad,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Cpu,
  Clock,
  X
} from 'lucide-react';
import { analyzeReport } from '../api/api.js';
import Toast from '../components/Toast.jsx';
import './ReportAnalyzerPage.css';

export default function ReportAnalyzerPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [reportName, setReportName] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const selectFile = (selected) => {
    if (!selected) return;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const isPdf = selected.name.toLowerCase().endsWith('.pdf');
    if (!validTypes.includes(selected.type) && !isPdf) {
      setToast('Please upload a PDF, JPG, JPEG, or PNG medical report.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setToast('Please choose a file smaller than 10 MB.');
      return;
    }
    setFile(selected);
    if (!reportName) {
      setReportName(selected.name.replace(/\.[^/.]+$/, ''));
    }
    setResult(null);
    setToast(`"${selected.name}" is ready for report analysis.`);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!file) {
      setToast('Please select or drag & drop a medical report first.');
      return;
    }
    setLoading(true);
    setResult(null);
    setToast('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportName', reportName || file.name);
      formData.append('fileName', file.name);

      const response = await analyzeReport(formData);
      setResult(response.data);
      setToast('Report analysis completed successfully.');
    } catch (err) {
      setToast(err?.response?.data?.message || 'Unable to analyze this report right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <Toast message={toast} onClose={() => setToast('')} />

      {/* Header Banner */}
      <header className="report-header">
        <div>
          <span className="report-badge">Medical Report Analyzer</span>
          <h1>Upload a report for AI-powered insights</h1>
          <p>
            Extract key parameters, interpret lab findings, and understand flagged values with our intelligent diagnostic document screening.
          </p>
        </div>
        <div className="report-header-art" aria-hidden="true">
          <FileText size={78} />
          <Activity size={34} />
        </div>
      </header>

      {/* Workspace */}
      <section className="report-workspace">
        {/* Left Column - Input & Upload */}
        <div className="report-upload-column">
          {/* Drag & Drop File Upload Zone */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/jpeg,image/png,image/jpg"
            hidden
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
          <div
            className={`report-dropzone ${file ? 'has-file' : ''} ${dragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              selectFile(e.dataTransfer.files?.[0]);
            }}
          >
            {file ? (
              <div className="report-file-card">
                <div className="report-file-icon">
                  {file.name.endsWith('.pdf') ? <FileSpreadsheet size={32} /> : <FileText size={32} />}
                </div>
                <div className="report-file-details">
                  <span className="report-file-name">{file.name}</span>
                  <span className="report-file-meta">
                    {formatFileSize(file.size)} • Auto-Detect Category
                  </span>
                </div>
                <button
                  type="button"
                  className="report-remove-file"
                  onClick={clearFile}
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="report-upload-icon">
                  <FileUp size={32} />
                </div>
                <h2>Upload Medical Report</h2>
                <p>Drag & drop your PDF or image here, or browse files</p>
              </>
            )}

            {/* Optional Notes Input */}
            <div className="report-notes-box" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Notes or test title (optional, e.g. Fasting Lipid Panel)"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="report-notes-input"
              />
            </div>

            {/* Actions */}
            <div className="report-upload-actions">
              <button
                type="button"
                className="report-choose-button"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={17} />
                {file ? 'Choose another file' : 'Browse File'}
              </button>

              {file && (
                <button
                  type="button"
                  className="report-analyze-button"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="report-spin" size={17} />
                      Analyzing Report…
                    </>
                  ) : (
                    <>
                      <Cpu size={17} />
                      Analyze Report
                    </>
                  )}
                </button>
              )}
            </div>

            <small className="report-format-hint">Supports PDF, JPG, JPEG, PNG (Max 10MB)</small>
          </div>
        </div>

        {/* Right Column - How it works & Disclaimer */}
        <aside className="report-guide-column">
          <h2>How Report Analysis Works</h2>
          <ol className="report-steps">
            <li>
              <span className="report-step-icon">
                <FileUp size={21} />
              </span>
              <span>
                <b>Upload Report</b>
                <small>Select or drag & drop your lab result PDF, image scan, or handwritten note.</small>
              </span>
            </li>
            <li>
              <span className="report-step-icon">
                <Cpu size={21} />
              </span>
              <span>
                <b>AI Auto-Classification & OCR</b>
                <small>Multimodal AI automatically identifies report type, reading printed tables and doctor handwriting.</small>
              </span>
            </li>
            <li>
              <span className="report-step-icon">
                <FileSpreadsheet size={21} />
              </span>
              <span>
                <b>Smart Summary & Insights</b>
                <small>Receive plain-language summaries, extracted parameters, flagged markers, and action steps.</small>
              </span>
            </li>
          </ol>
        </aside>

        {/* Analysis Results Display */}
        {result && (
          <section className="report-result-panel">
            {result.emergencyWarning && (
              <div className="report-emergency-banner">
                <AlertTriangle size={24} />
                <div>
                  <strong>{result.emergencyWarning.headline || '🚨 Urgent Clinical Warning'}</strong>
                  <p>{result.emergencyWarning.message}</p>
                </div>
              </div>
            )}

            <div className="report-result-heading">
              <div>
                <div className="report-tags-row">
                  <span className="report-category-tag detected-tag">
                    🩺 Detected: <strong>{result.detectedCategory || result.reportType || 'Diagnostic Report'}</strong>
                  </span>
                  {result.writingStyle && (
                    <span className="report-writing-tag">
                      ✍️ Format: <strong>{result.writingStyle}</strong>
                    </span>
                  )}
                  {result.suggestedSpecialist && (
                    <span className="report-specialist-tag">
                      👨‍⚕️ Specialist: <strong>{result.suggestedSpecialist}</strong>
                    </span>
                  )}
                </div>
                <h2>{result.title}</h2>
              </div>
              <span
                className={`report-status-badge ${
                  result.riskLevel === 'Critical' || (result.abnormalValues && result.abnormalValues.length > 0)
                    ? 'attention'
                    : 'normal'
                }`}
              >
                {result.abnormalValues && result.abnormalValues.length > 0
                  ? `Attention: ${result.abnormalValues.length} Flagged Marker(s)`
                  : 'Normal Parameters'}
              </span>
            </div>

            <p className="report-result-summary">{result.summary}</p>

            {/* Writing / Handwriting Analysis Notes */}
            {result.writingAnalysisNotes && (
              <div className="report-writing-notes-box">
                <strong>📝 Document & Handwriting Recognition:</strong>
                <p>{result.writingAnalysisNotes}</p>
              </div>
            )}

            {/* Extracted Lab Parameters Table */}
            {result.parameters && result.parameters.length > 0 && (
              <div className="report-parameters-section">
                <h3>
                  <FileSpreadsheet size={18} />
                  Extracted Lab Parameters & Diagnostic Markers
                </h3>
                <div className="report-table-wrapper">
                  <table className="report-parameters-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Measured Value</th>
                        <th>Reference Range</th>
                        <th>Status</th>
                        <th>Clinical Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.parameters.map((param, index) => (
                        <tr key={index} className={`param-row-${(param.status || 'normal').toLowerCase()}`}>
                          <td className="param-name">{param.parameter}</td>
                          <td className="param-value"><strong>{param.value}</strong></td>
                          <td className="param-ref">{param.referenceRange || 'N/A'}</td>
                          <td>
                            <span className={`param-status-pill ${(param.status || 'normal').toLowerCase()}`}>
                              {param.status || 'Normal'}
                            </span>
                          </td>
                          <td className="param-interp">{param.interpretation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Comprehensive Report Summary Card (Point-Wise, Preventions & Diet) */}
            <div className="comprehensive-summary-card">
              <div className="summary-card-header">
                <FileText size={24} className="summary-main-icon" />
                <div>
                  <h3>Comprehensive Report Summary</h3>
                  <p>Clear point-by-point explanation, preventive precautions, and targeted food intake guidance.</p>
                </div>
              </div>

              {/* 1. Point-Wise Key Takeaways */}
              <div className="summary-block takeaways-block">
                <h4>
                  <ListChecks size={19} className="block-icon blue" />
                  Report Key Takeaways (Point-Wise Summary)
                </h4>
                <ul className="summary-bullet-list">
                  {result.summaryPoints && result.summaryPoints.length > 0 ? (
                    result.summaryPoints.map((point, index) => (
                      <li key={index}>
                        <CheckCircle2 size={16} className="bullet-icon green" />
                        <span>{point}</span>
                      </li>
                    ))
                  ) : (
                    <li>
                      <CheckCircle2 size={16} className="bullet-icon green" />
                      <span>{result.summary || 'Your report parameters have been processed and analyzed.'}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* 2. Preventive Measures & Health Precautions */}
              {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
                <div className="summary-block prevention-block">
                  <h4>
                    <ShieldAlert size={19} className="block-icon amber" />
                    Preventive Measures & Health Precautions
                  </h4>
                  <ul className="summary-bullet-list">
                    {result.preventiveMeasures.map((item, index) => (
                      <li key={index}>
                        <ShieldCheck size={16} className="bullet-icon amber-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Targeted Dietary & Food Intake Recommendations */}
              {result.dietaryRecommendations && result.dietaryRecommendations.length > 0 && (
                <div className="summary-block diet-block">
                  <h4>
                    <Apple size={19} className="block-icon emerald" />
                    Recommended Diet & Food Intake Plan
                  </h4>
                  <div className="diet-items-grid">
                    {result.dietaryRecommendations.map((item, index) => {
                      const parts = item.split(':');
                      const title = parts.length > 1 ? parts[0] : null;
                      const body = parts.length > 1 ? parts.slice(1).join(':') : item;
                      return (
                        <div key={index} className="diet-item-card">
                          <Salad size={18} className="diet-icon" />
                          <div>
                            {title ? <strong className="diet-title">{title}: </strong> : null}
                            <span className="diet-body">{body}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <p className="report-result-disclaimer">
              <ShieldCheck size={16} />
              <span>{result.disclaimer || 'Disclaimer: Consult with your doctor to interpret lab results in the context of your complete medical history.'}</span>
            </p>
          </section>
        )}

        {/* Footer History Strip */}
        <footer className="report-history">
          <div className="report-history-left">
            <span className="report-history-icon">
              <Clock size={20} />
            </span>
            <div>
              <b>Your Saved Report Analyses</b>
              <p>
                {result
                  ? 'Your latest report summary is ready above and saved to your health history.'
                  : 'Access your past lab summaries, diagnostic history, and doctor reports anytime.'}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/app/history?type=report')}>
            View History
          </button>
        </footer>
      </section>
    </div>
  );
}
