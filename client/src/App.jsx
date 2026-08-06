import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { useDashboard } from './context/DashboardContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import HomePage from './pages/HomePage.jsx';
import SymptomCheckerPage from './pages/SymptomCheckerPage.jsx';
import ReportAnalyzerPage from './pages/ReportAnalyzerPage.jsx';
import XRayAnalyzerPage from './pages/XRayAnalyzerPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import DoctorDirectoryPage from './pages/DoctorDirectoryPage.jsx';
import CostEstimatorPage from './pages/CostEstimatorPage.jsx';
import MedicineInfoPage from './pages/MedicineInfoPage.jsx';
import AssistantPage from './pages/AssistantPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginModal from './components/LoginModal.jsx';
import RegisterModal from './components/RegisterModal.jsx';
import LogoutModal from './components/LogoutModal.jsx';
import AmbientEffects from './components/AmbientEffects.jsx';
import FloatingAiChat from './components/FloatingAiChat.jsx';
import WaterAlarm from './components/WaterAlarm.jsx';

/**
 * The single authenticated layout.
 * When showDashboard is TRUE  → renders Navbar + Sidebar (left) + content (right)
 * When showDashboard is FALSE → renders Navbar + full-width content (no sidebar)
 */
function AppLayout({ darkMode, onToggleTheme }) {
  const { showDashboard } = useDashboard();

  return (
    <div className={`app-shell ${showDashboard ? 'app-shell-dashboard' : ''}`}>
      <Navbar />
      {showDashboard ? (
        <div className="app-main-layout">
          <Sidebar />
          <main className="app-content app-content-with-sidebar">
            <Outlet context={{ darkMode, onToggleTheme }} />
            <Footer />
          </main>
        </div>
      ) : (
        <>
          <main className="app-content">
            <Outlet context={{ darkMode, onToggleTheme }} />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

function App() {
  const { user, showSplash } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('vitalis_theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('vitalis_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((p) => !p);

  return (
    <div className="app-root">
      <AmbientEffects />
      <FloatingAiChat />
      <WaterAlarm />
      <LoginModal />
      <RegisterModal />
      <LogoutModal />

      {showSplash && (
        <div className="vitalis-splash-overlay" aria-hidden="true">
          <div className="vitalis-splash-bg" />

          {/* Phase 1: Heartbeat ECG line */}
          <div className="vitalis-splash-stage stage-ecg">
            <svg
              className="vitalis-ecg-line"
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
              width="320"
              height="80"
            >
              <defs>
                <linearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(120,177,255,0.0)" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="rgba(120,177,255,0.0)" />
                </linearGradient>
              </defs>
              <polyline
                className="vitalis-ecg-poly"
                fill="none"
                stroke="url(#ecgGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,60 110,60 130,60 140,20 150,100 165,20 175,90 190,60 220,60 230,35 240,85 255,60 400,60"
              />
              <polyline
                className="vitalis-ecg-poly vitalis-ecg-glow"
                fill="none"
                stroke="#78b1ff"
                strokeWidth="6"
                strokeOpacity="0.35"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,60 110,60 130,60 140,20 150,100 165,20 175,90 190,60 220,60 230,35 240,85 255,60 400,60"
              />
            </svg>
          </div>

          {/* Phase 2 + 3: Logo mark (heart + embedded ECG) */}
          <div className="vitalis-splash-logo-mark">
            <svg viewBox="0 0 200 180" width="200" height="180" aria-label="Vitalis logo">
              <defs>
                <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(120,177,255,0.45)" />
                  <stop offset="100%" stopColor="rgba(120,177,255,0)" />
                </radialGradient>
                <linearGradient id="heartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e73e0" />
                  <stop offset="100%" stopColor="#0863ce" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="90" r="92" fill="url(#heartGlow)" className="vitalis-heart-halo" />
              {/* Heart outline + shape (transparent inside, thick white outline + subtle inner glow) */}
              <path
                className="vitalis-heart-outline vitalis-heart-outline-inner"
                d="M100 154 C 42 118, 24 82, 44 56 C 56 38, 80 34, 100 56 C 120 34, 144 38, 156 56 C 176 82, 158 118, 100 154 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
              />
              <path
                d="M100 154 C 42 118, 24 82, 44 56 C 56 38, 80 34, 100 56 C 120 34, 144 38, 156 56 C 176 82, 158 118, 100 154 Z"
                fill="none"
                stroke="#78b1ff"
                strokeOpacity="0.45"
                strokeWidth="10"
                style={{ filter: 'blur(3px)' }}
              />
              {/* Embedded ECG line inside the heart (like the VITALIS logo) */}
              <polyline
                className="vitalis-heart-ecg"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="52,92 76,92 83,72 90,112 98,76 104,104 110,84 118,92 148,92"
              />
            </svg>
          </div>

          {/* Phase 3: VITALIS text next to the shrunken logo */}
          <div className="vitalis-splash-brand-row">
            <h1 className="vitalis-splash-text">VITALIS</h1>
          </div>
          <p className="vitalis-splash-sub">AI Health Navigator</p>
        </div>
      )}

      <Routes>
        {/* Landing: redirect authenticated users to /app so back-button can't return here */}
        <Route path="/" element={user ? <Navigate to="/app" replace /> : <LandingPage />} />
        <Route path="/login"    element={user ? <Navigate to="/app" replace /> : <Navigate to="/" replace />} />
        <Route path="/register" element={user ? <Navigate to="/app" replace /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />

        {/* All authenticated routes — sidebar visibility controlled by showDashboard context */}
        <Route path="/app" element={<ProtectedRoute><AppLayout darkMode={darkMode} onToggleTheme={toggleTheme} /></ProtectedRoute>}>
          <Route index           element={<HomePage />} />
          <Route path="symptoms" element={<SymptomCheckerPage />} />
          <Route path="reports"  element={<ReportAnalyzerPage />} />
          <Route path="xray"     element={<XRayAnalyzerPage />} />
          <Route path="history"  element={<HistoryPage />} />
          <Route path="doctors"  element={<DoctorDirectoryPage />} />
          <Route path="cost-estimator" element={<CostEstimatorPage />} />
          <Route path="medicine" element={<MedicineInfoPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="profile"  element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage darkMode={darkMode} onToggleTheme={toggleTheme} />} />
        </Route>

        {/* Convenience alias redirects for assistant & chat */}
        <Route path="/assistant"     element={<Navigate to="/app/assistant" replace />} />
        <Route path="/chat"          element={<Navigate to="/app/assistant" replace />} />
        <Route path="/dev/assistant" element={<Navigate to="/app/assistant" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
