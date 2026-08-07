import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, BrainCircuit, Check, CheckCircle2, ClipboardList, CloudUpload, FileImage, LoaderCircle, ScanLine, ShieldCheck, Upload } from 'lucide-react';
import { analyzeXray } from '../api/api.js';
import Toast from '../components/Toast.jsx';
import './XRayAnalyzerPage.css';

export default function XRayAnalyzerPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const selectFile = (selected) => {
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selected.type)) return setToast('Please choose a JPG, JPEG, or PNG X-ray image.');
    if (selected.size > 5 * 1024 * 1024) return setToast('Please choose an X-ray image smaller than 5 MB.');
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setToast(`${selected.name} is ready for analysis.`);
  };

  const submitAnalysis = async () => {
    if (!file) return setToast('Choose an X-ray image first.');
    setLoading(true); setResult(null);
    try { const response = await analyzeXray(file); setResult(response.data); }
    catch (error) { setToast(error?.response?.data?.message || 'Unable to analyze this X-ray right now. Please try again.'); }
    finally { setLoading(false); }
  };

  return <div className="xray-page">
    <Toast message={toast} onClose={() => setToast('')} />
    <header className="xray-header">
      <div>
        <h1>X-ray Analysis</h1>
        <p>Upload your X-ray image and get AI-assisted insights with highlighted findings and risk indicators.</p>
      </div>
      <div className="xray-header-art" aria-hidden="true">
        <div className="xray-graphic xray-graphic-1"><ScanLine size={32} /></div>
        <div className="xray-graphic xray-graphic-2"><ShieldCheck size={28} /></div>
        <div className="xray-graphic xray-graphic-3"><FileImage size={36} /></div>
      </div>
    </header>
    <section className="xray-workspace">
      <div className="xray-upload-column">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden onChange={(event) => selectFile(event.target.files?.[0])} />
        <div className={`xray-dropzone ${file ? 'has-file' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }}>
          {previewUrl ? <img className="xray-preview" src={previewUrl} alt="Selected X-ray preview" /> : <div className="xray-upload-icon"><CloudUpload size={32} /></div>}
          <h2>{file ? file.name : 'Upload X-ray Image'}</h2><p>{file ? 'Preview ready. Start the analysis when you are ready.' : 'Drag & drop your file here or browse'}</p>
          <div className="xray-upload-actions"><button type="button" className="xray-choose-button" onClick={() => inputRef.current?.click()}><Upload size={17} /> {file ? 'Choose another file' : 'Choose File'}</button>{file && <button type="button" className="xray-analyze-button" disabled={loading} onClick={submitAnalysis}>{loading ? <><LoaderCircle className="xray-spin" size={17} /> Analyzing…</> : <><BrainCircuit size={17} /> Analyze X-ray</>}</button>}</div>
          <small>Supports: JPG, JPEG, PNG (Max 5MB)</small>
        </div>
      </div>
      <aside className="xray-guide-column"><h2>How it works</h2><ol className="xray-steps"><li><span className="xray-step-icon"><CloudUpload size={21} /></span><span><b>Upload X-ray</b><small>Upload a clear X-ray image.</small></span></li><li><span className="xray-step-icon"><BrainCircuit size={21} /></span><span><b>AI Analysis</b><small>Our AI screens the image for visible patterns.</small></span></li><li><span className="xray-step-icon"><ClipboardList size={21} /></span><span><b>View Results</b><small>Get educational insights and next steps.</small></span></li></ol></aside>
      {result && (
        <section className="xray-result-panel">
          <div className="xray-result-heading">
            <div>
              <p>Analysis complete</p>
              <h2>{result.title}</h2>
            </div>
            <span className={`xray-risk xray-risk-${String(result.riskLevel).toLowerCase().replaceAll(' ', '-')}`}>
              {result.riskLevel}
            </span>
          </div>

          <p className="xray-result-summary">{result.summary}</p>

          {/* Injury & Defect Analysis Card */}
          {(result.detectedDefect || result.whatHappened || result.normalComparison) && (
            <div className="xray-defect-card">
              <div className="xray-defect-header">
                <AlertTriangle size={22} className="defect-header-icon" />
                <div>
                  <span className="xray-defect-tag">Structural & Defect Diagnosis</span>
                  <h3>{result.detectedDefect || 'Identified Radiographic Finding'}</h3>
                </div>
              </div>

              {result.whatHappened && (
                <div className="xray-defect-block">
                  <h4>⚡ What Happened / Injury Analysis</h4>
                  <p>{result.whatHappened}</p>
                </div>
              )}

              {result.normalComparison && (
                <div className="xray-defect-block comparison-block">
                  <h4>🔍 Normal Anatomy vs. Detected Defect</h4>
                  <p>{result.normalComparison}</p>
                </div>
              )}
            </div>
          )}

          <div className="xray-result-grid">
            <article>
              <h3>Key observations</h3>
              <ul>
                {result.findings.map((item, index) => (
                  <li key={index}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="xray-summary-article">
              <h3>Summary</h3>
              <ul>
                {(result.summaryPoints && result.summaryPoints.length > 0
                  ? result.summaryPoints
                  : [
                      'Your X-ray picture is clear and shows your bones sitting in a good, normal posture.',
                      'There are no sharp breaks, bent bones, or foreign objects showing up in the scan.',
                      'You can feel reassured that your main skeletal framework looks stable and intact.'
                    ]
                ).map((item, index) => (
                  <li key={index}>
                    <CheckCircle2 size={16} className="xray-summary-bullet-icon" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <p className="xray-result-disclaimer">
            <ShieldCheck size={15} /> {result.disclaimer}
          </p>
        </section>
      )}
      <footer className="xray-history">
        <div>
          <span className="xray-history-icon">◷</span>
          <b>Your Recent Analyses</b>
          <p>
            {result
              ? 'Your latest X-ray analysis is ready above and saved to your health history.'
              : 'No X-ray analyses yet. Upload your first X-ray to see your history here.'}
          </p>
        </div>
        <button type="button" onClick={() => navigate('/app/history?type=xray')}>
          View All History
        </button>
      </footer>
    </section>
  </div>;
}
