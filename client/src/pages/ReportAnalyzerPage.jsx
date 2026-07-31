import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Activity,
  Check,
  CheckCircle2,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FileUp,
  LoaderCircle,
  ShieldCheck,
  Upload,
  Cpu,
  Clock,
  X
} from 'lucide-react';
import { analyzeReport } from '../api/api.js';
import Toast from '../components/Toast.jsx';
import './ReportAnalyzerPage.css';

const REPORT_CATEGORIES = [
  'Blood Test',
  'CBC (Complete Blood Count)',
  'Lipid Profile',
  'Thyroid Panel',
  'Kidney & Liver',
  'ECG / EKG Report',
  'MRI / CT Scan',
  'Other Lab Report'
];

export default function ReportAnalyzerPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [reportType, setReportType] = useState('Blood Test');
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
      const payload = {
        reportType,
        reportName: reportName || file.name,
        fileName: file.name,
        fileText: file.name
      };
      const response = await analyzeReport(payload);
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
          {/* Report Category Selector */}
          <div className="report-category-section">
            <label className="report-label-title">Select Report Type</label>
            <div className="report-category-grid">
              {REPORT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`report-cat-chip ${reportType === cat ? 'active' : ''}`}
                  onClick={() => setReportType(cat)}
                >
                  {reportType === cat && <CheckCircle2 size={14} />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

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
                    {formatFileSize(file.size)} • {reportType}
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

          {/* Tips for Best Results */}
          <div className="report-tips-card">
            <div className="report-tips-header">
              <FileCheck2 size={20} />
              <strong>Tips for Best Analysis Results</strong>
            </div>
            <ul>
              <li>
                <Check size={16} /> Ensure lab values, test names, and reference ranges are clear and legible
              </li>
              <li>
                <Check size={16} /> Upload complete pages without cropping critical diagnostic parameters
              </li>
              <li>
                <Check size={16} /> Select the matching report category above for accurate evaluation
              </li>
            </ul>
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
                <small>Select or drag & drop your lab result PDF or document scan.</small>
              </span>
            </li>
            <li>
              <span className="report-step-icon">
                <Cpu size={21} />
              </span>
              <span>
                <b>AI Screening & Extraction</b>
                <small>Our AI evaluates clinical values against standard medical reference ranges.</small>
              </span>
            </li>
            <li>
              <span className="report-step-icon">
                <FileSpreadsheet size={21} />
              </span>
              <span>
                <b>Smart Summary & Insights</b>
                <small>Receive a plain-language summary, flagged markers, and action steps.</small>
              </span>
            </li>
          </ol>

          <div className="report-note-card">
            <ShieldCheck size={20} />
            <div>
              <strong>Important Medical Notice</strong>
              <p>
                This AI analysis is provided for educational and informational guidance only. It does not substitute for a professional diagnosis. Please consult a qualified physician to review your medical reports.
              </p>
            </div>
          </div>
        </aside>

        {/* Analysis Results Display */}
        {result && (
          <section className="report-result-panel">
            <div className="report-result-heading">
              <div>
                <span className="report-category-tag">{reportType}</span>
                <h2>{result.title}</h2>
              </div>
              <span
                className={`report-status-badge ${
                  result.abnormalValues && result.abnormalValues.length > 0 ? 'attention' : 'normal'
                }`}
              >
                {result.abnormalValues && result.abnormalValues.length > 0
                  ? `Attention: ${result.abnormalValues.length} Flagged Marker(s)`
                  : 'Normal Parameters'}
              </span>
            </div>

            <p className="report-result-summary">{result.summary}</p>

            <div className="report-result-grid">
              <article className="report-result-card">
                <h3>
                  <CheckCircle2 size={18} className="icon-success" />
                  Key Observations & Findings
                </h3>
                <ul>
                  {result.findings && result.findings.length > 0 ? (
                    result.findings.map((item, index) => (
                      <li key={index}>
                        <Check size={16} />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li><span>No specific findings listed.</span></li>
                  )}
                </ul>
              </article>

              <article className="report-result-card">
                <h3>
                  <AlertTriangle size={18} className="icon-warning" />
                  Important / Flagged Lab Markers
                </h3>
                {result.abnormalValues && result.abnormalValues.length > 0 ? (
                  <ul className="report-abnormal-list">
                    {result.abnormalValues.map((item, index) => (
                      <li key={index} className="abnormal-item">
                        <AlertTriangle size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="report-all-normal">
                    <CheckCircle2 size={20} />
                    <p>All extracted parameters are within standard reference ranges.</p>
                  </div>
                )}
              </article>
            </div>

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="report-recommendations-block">
                <h3>Recommended Next Steps</h3>
                <ul>
                  {result.recommendations.map((item, index) => (
                    <li key={index}>
                      <Activity size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="report-result-disclaimer">
              <ShieldCheck size={16} />
              <span>{result.disclaimer || 'Disclaimer: Consult with your doctor to interpret lab results in the context of your complete medical history.'}</span>
            </p>
          </section>
        )}

        {/* Footer History Strip */}
        <footer className="report-history">
          <div>
            <span className="report-history-icon">
              <Clock size={18} />
            </span>
            <b>Your Saved Report Analyses</b>
            <p>
              {result
                ? 'Your latest report summary is ready above and saved to your health history.'
                : 'Access your past lab summaries, diagnostic history, and doctor reports anytime.'}
            </p>
          </div>
          <button type="button" onClick={() => navigate('/app/history')}>
            View History
          </button>
        </footer>
      </section>
    </div>
  );
}
