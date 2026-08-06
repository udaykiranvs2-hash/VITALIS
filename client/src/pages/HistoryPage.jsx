import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchHistory } from '../api/api.js';
import Loader from '../components/Loader.jsx';

function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('type') || searchParams.get('filter') || 'all';
  const [activeTab, setActiveTab] = useState(initialFilter);
  const [history, setHistory] = useState({ reports: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const typeParam = searchParams.get('type') || searchParams.get('filter');
    if (typeParam) {
      setActiveTab(typeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const response = await fetchHistory();
        setHistory(response.data);
      } catch {
        setError('Unable to load health history.');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ type: tab });
  };

  const filteredReports = (history.reports || []).filter((report) => {
    const isXray = report.type === 'X-ray' || report.title?.toLowerCase().includes('x-ray');
    if (activeTab === 'xray') return isXray;
    if (activeTab === 'report') return !isXray;
    return true;
  });

  const getHeadingText = () => {
    if (activeTab === 'xray') return 'X-Ray Analysis History';
    if (activeTab === 'report') return 'Report Analysis History';
    return 'Track records and report summaries.';
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">
            {activeTab === 'xray'
              ? 'X-Ray History'
              : activeTab === 'report'
              ? 'Report Analysis History'
              : 'Health History'}
          </p>
          <h1>{getHeadingText()}</h1>
        </div>

        {/* Category Tabs */}
        <div className="history-tab-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`secondary-button ${activeTab === 'all' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All History
          </button>
          <button
            type="button"
            className={`secondary-button ${activeTab === 'report' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('report')}
          >
            📄 Report Analysis
          </button>
          <button
            type="button"
            className={`secondary-button ${activeTab === 'xray' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('xray')}
          >
            🩻 X-Ray Analysis
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading health history…" />
      ) : error ? (
        <p className="form-message error">{error}</p>
      ) : (
        <div className="timeline-grid">
          <section>
            <h2>
              {activeTab === 'xray'
                ? 'Recent X-Ray Analyses'
                : activeTab === 'report'
                ? 'Recent Report Analyses'
                : 'Recent Reports'}
            </h2>
            {filteredReports.length ? (
              <ul className="timeline-list">
                {filteredReports.map((report, idx) => {
                  const dateVal = report.uploadedAt || report.createdAt || report.created_at;
                  const dateObj = dateVal ? new Date(dateVal) : new Date();
                  const formattedDate = isNaN(dateObj.getTime())
                    ? new Date().toLocaleDateString()
                    : dateObj.toLocaleDateString();
                  const isXray = report.type === 'X-ray' || report.title?.toLowerCase().includes('x-ray');
                  return (
                    <li key={report._id || report.id || idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <strong>{report.title}</strong>
                        <span className={`report-tag-pill ${isXray ? 'xray-tag' : 'lab-tag'}`}>
                          {isXray ? '🩻 X-Ray' : '📄 Lab Report'}
                        </span>
                      </div>
                      <p>{report.summary}</p>
                      <span>{formattedDate}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="empty-state">
                {activeTab === 'xray'
                  ? 'No X-ray analyses recorded yet.'
                  : activeTab === 'report'
                  ? 'No report analyses recorded yet.'
                  : 'No uploaded reports yet.'}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
