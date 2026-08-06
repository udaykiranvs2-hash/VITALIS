import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchHistory } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboard } from '../context/DashboardContext.jsx';
import {
  Lightbulb,
  FileText,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
  PhoneCall,
  Ambulance,
  Building2,
  Siren,
  ArrowRight,
  Clock,
  CheckCircle2,
  Activity,
  ScanHeart,
  Calculator,
  Users,
  HeartPulse,
} from 'lucide-react';
import './HomePage.css';

/* ─── Dashboard 6-card grid (shown when Dashboard button is toggled) ─── */
const FEATURES = [
  { title: 'Symptom Checker',  subtitle: 'Start Check',      icon: Activity,    path: '/app/symptoms'       },
  { title: 'Report Analysis',  subtitle: 'Upload Report',    icon: FileText,    path: '/app/reports'        },
  { title: 'X-ray Analysis',   subtitle: 'Analyze X-ray',   icon: ScanHeart,   path: '/app/xray'           },
  { title: 'Cost Estimation',  subtitle: 'Estimate Now',     icon: Calculator,  path: '/app/cost-estimator' },
  { title: 'Doctor Connection',subtitle: 'Find Doctors',     icon: Users,       path: '/app/doctors'        },
  { title: 'AI Health Chat',   subtitle: 'Start Chat',       icon: MessageSquare, path: '/app/assistant'    },
];

function DashboardPanel({ firstName }) {
  const navigate = useNavigate();
  return (
    <div className="home-dashboard-panel">
      <header className="home-dashboard-header">
        <h1>Welcome back, {firstName} <span role="img" aria-label="wave">👋</span></h1>
        <p>How can we help you today?</p>
      </header>

      <div className="home-dashboard-grid">
        {FEATURES.map(({ title, subtitle, icon: Icon, path }) => (
          <div key={title} className="home-dashboard-card" onClick={() => navigate(path)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate(path)}>
            <div className="home-dashboard-icon">
              <Icon size={30} color="#0863ce" />
            </div>
            <div>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="home-dashboard-footer">
        <HeartPulse size={22} color="#0863ce" />
        <span>Your Health Companion</span>
      </div>
    </div>
  );
}

/* ─── Welcome Home page (default after login) ─── */
function WelcomeHome({ firstName }) {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const HEALTH_TIPS = [
    "Walking 30 minutes daily can reduce the risk of heart disease and improve your mental well-being.",
    "Drink at least 8 glasses of water a day to keep your body hydrated and maintain energy levels.",
    "Aim for 7-9 hours of quality sleep each night to allow your body and mind to recover.",
    "Include a source of protein in every meal to help maintain muscle mass and keep you feeling full.",
    "Take short breaks every hour to stretch and rest your eyes if you work at a computer.",
    "Eating a rainbow of fruits and vegetables ensures you get a wide variety of essential vitamins.",
    "Practice deep breathing for just 5 minutes a day to significantly lower stress levels.",
    "Limit added sugars to protect against inflammation, weight gain, and chronic diseases.",
    "Regular handwashing is one of the most effective ways to prevent the spread of infections.",
    "Incorporate strength training at least twice a week to build bone density and metabolic health.",
    "Substitute refined grains with whole grains to increase your daily fiber intake.",
    "Chew your food slowly to improve digestion and recognize when you are full.",
    "Spend time outdoors daily; sunlight helps your body produce Vitamin D for bone health.",
    "Minimize screen time at least one hour before bed for a better night's sleep.",
    "Laughing reduces stress hormones and increases immune cells and infection-fighting antibodies.",
    "Nuts and seeds are excellent sources of healthy fats that protect your heart and brain.",
    "Avoid skipping meals to maintain steady blood sugar levels throughout the day.",
    "Practice good posture to prevent back and neck pain, especially while sitting.",
    "Stay socially connected; strong relationships contribute to a longer, healthier life.",
    "Use sunscreen daily to protect your skin from harmful UV rays and prevent premature aging."
  ];

  const tipsRef = useRef([...HEALTH_TIPS].sort(() => Math.random() - 0.5));
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => {
        if (prev + 1 >= tipsRef.current.length) {
          tipsRef.current = [...HEALTH_TIPS].sort(() => Math.random() - 0.5);
          return 0;
        }
        return prev + 1;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getReports = async () => {
      try {
        const response = await fetchHistory();
        if (isMounted) {
          setRecentReports(response.data?.reports?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent reports", error);
      } finally {
        if (isMounted) setLoadingReports(false);
      }
    };
    getReports();
    return () => { isMounted = false; };
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="home-page">
      {toastMessage && (
        <div className="home-toast">
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Hero */}
      <section className="home-hero-banner">
        <div className="home-hero-content">
          <div className="home-greeting-header">
            <h1>{greeting}, {firstName}! 👋</h1>
            <p className="home-hero-subtitle">Welcome back to Vitalis.</p>
            <p className="home-hero-desc">Your AI Health Companion is ready to assist you.</p>
          </div>
        </div>
        <div className="home-hero-illustration">
          <img
            src="/doctor-3d.png"
            alt="3D Doctor Illustration"
            className="home-doctor-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </section>

      {/* Cards grid */}
      <div className="home-main-grid">
        {/* AI Health Tip */}
        <article className="home-card home-tip-card">
          <div className="home-card-header">
            <div className="home-card-title">
              <Lightbulb size={22} className="icon-yellow" />
              <h2>AI Health Tip</h2>
            </div>
          </div>
          <div className="home-tip-body">
            <div className="home-tip-text">
              <p className="home-tip-quote">
                "{tipsRef.current[tipIndex]}"
              </p>
              <button type="button" className="home-link-btn" onClick={() => navigate('/app/assistant')}>
                Learn More <ArrowRight size={16} />
              </button>
            </div>
            <div className="home-tip-graphic">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" fill="#ECFDF5" />
                <path d="M50 75C50 75 35 60 35 45C35 36.7157 41.7157 30 50 30C58.2843 30 65 36.7157 65 45C65 60 50 75 50 75Z" fill="#10B981" fillOpacity="0.2" />
                <path d="M50 70C50 70 38 56 38 44C38 37.3726 43.3726 32 50 32C56.6274 32 62 37.3726 62 44C62 56 50 70 50 70Z" fill="#10B981" />
                <path d="M45 42C45 42 48 38 52 40C56 42 54 48 50 50C46 52 46 56 50 58" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </article>

        {/* Recent Reports */}
        <article className="home-card home-reports-card">
          <div className="home-card-header">
            <div className="home-card-title">
              <FileText size={22} className="icon-blue" />
              <h2>Recent Reports</h2>
            </div>
            <Link to="/app/reports" className="home-view-all">View all</Link>
          </div>
          <div className="home-reports-list">
            {loadingReports ? (
              <div className="home-report-item"><p>Loading reports...</p></div>
            ) : recentReports.length > 0 ? (
              recentReports.map((r) => (
                <div key={r._id || r.uploadedAt} className="home-report-item" onClick={() => navigate('/app/reports')}>
                  <div className="home-report-icon"><FileText size={18} /></div>
                  <div className="home-report-details">
                    <h4>{r.title || 'Health Report'}</h4>
                    <p>{r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : 'Recently'}</p>
                  </div>
                  <span className="home-badge badge-reviewed">Reviewed</span>
                </div>
              ))
            ) : (
              <div className="home-report-item" style={{ justifyContent: 'center', padding: '2rem 1rem' }}>
                <p style={{ color: '#64748b' }}>No recent reports</p>
              </div>
            )}
          </div>
        </article>

        {/* Upcoming Appointment */}
        <article className="home-card home-appointment-card">
          <div className="home-card-header">
            <div className="home-card-title">
              <Calendar size={22} className="icon-blue" />
              <h2>Upcoming Appointment</h2>
            </div>
            <Link to="/app/doctors" className="home-view-all">View all</Link>
          </div>
          <div className="home-doctor-card">
            <div className="home-doctor-info">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&auto=format&fit=crop&q=80"
                alt="Dr. Arjun Patel"
                className="home-doctor-avatar"
              />
              <div>
                <h3>Dr. Arjun Patel</h3>
                <p>Cardiologist</p>
              </div>
            </div>
            <div className="home-appointment-pills">
              <span className="home-pill"><Calendar size={13} /> 28 May 2025</span>
              <span className="home-pill"><Clock size={13} /> 11:00 AM</span>
            </div>
            <div className="home-appointment-actions">
              <button type="button" className="home-btn-primary" onClick={() => showToast('Joining video consultation room...')}>Join</button>
              <button type="button" className="home-btn-secondary" onClick={() => showToast('Opening reschedule options...')}>Reschedule</button>
            </div>
          </div>
        </article>

        {/* Emergency Access */}
        <article className="home-card home-emergency-card">
          <div className="home-card-header">
            <div className="home-card-title">
              <AlertTriangle size={22} className="icon-red" />
              <h2 className="text-red">Emergency Access <span style={{fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginLeft: '8px'}}>(Coming soon)</span></h2>
            </div>
          </div>
          <div className="home-emergency-grid">
            <button type="button" className="home-emergency-btn" onClick={() => showToast('Calling Emergency Ambulance (108)...')}>
              <div className="home-emr-icon bg-red"><Ambulance size={20} /></div>
              <span>Ambulance</span>
            </button>
            <button type="button" className="home-emergency-btn" onClick={() => showToast('Calling Primary Emergency Family Contact...')}>
              <div className="home-emr-icon bg-blue"><PhoneCall size={20} /></div>
              <span>Call Family</span>
            </button>
            <button type="button" className="home-emergency-btn" onClick={() => navigate('/app/doctors')}>
              <div className="home-emr-icon bg-green"><Building2 size={20} /></div>
              <span>Nearest Hospital</span>
            </button>
            <button type="button" className="home-emergency-btn" onClick={() => showToast('🚨 SOS ACTIVATED!')}>
              <div className="home-emr-icon bg-sos"><Siren size={20} /></div>
              <span className="sos-label">Emergency SOS</span>
            </button>
          </div>
        </article>
      </div>

      {/* Help Banner */}
      <section className="home-help-banner">
        <div className="home-help-left">
          <ShieldCheck size={22} className="icon-blue" />
          <p><strong>Need Help?</strong> Our AI Assistant is here for you 24/7.</p>
        </div>
        <button type="button" className="home-chat-btn" onClick={() => navigate('/app/assistant')}>
          <MessageSquare size={16} /> Chat with AI Assistant
        </button>
      </section>

      <footer className="home-page-footer">
        <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy'); }}>Privacy Policy</a>
        <a href="#disclaimer" onClick={(e) => { e.preventDefault(); showToast('Medical Disclaimer'); }}>Medical Disclaimer</a>
        <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms of Use'); }}>Terms of Use</a>
        <a href="#support" onClick={(e) => { e.preventDefault(); showToast('Contact Support'); }}>Contact Support</a>
      </footer>
    </div>
  );
}

/* ─── Main export — switches between Welcome and Dashboard panel ─── */
export default function HomePage() {
  const { user } = useAuth();
  const { showDashboard } = useDashboard();

  const fullName  = user?.profile?.fullName || user?.name || 'User';
  const firstName = fullName.split(' ')[0] || fullName;

  return showDashboard ? <DashboardPanel firstName={firstName} /> : <WelcomeHome firstName={firstName} />;
}
