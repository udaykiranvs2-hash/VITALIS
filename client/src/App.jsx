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
import AmbientEffects from './components/AmbientEffects.jsx';
import FloatingAiChat from './components/FloatingAiChat.jsx';

/**
 * The single authenticated layout.
 * When showDashboard is TRUE  → renders Navbar + Sidebar (left) + content (right)
 * When showDashboard is FALSE → renders Navbar + full-width content (no sidebar)
 */
function AppLayout({ darkMode, onToggleTheme }) {
  const { showDashboard } = useDashboard();

  return (
    <div className="app-shell">
      <Navbar />
      {showDashboard ? (
        <div className="app-main-layout">
          <Sidebar />
          <main className="app-content app-content-with-sidebar">
            <Outlet context={{ darkMode, onToggleTheme }} />
          </main>
        </div>
      ) : (
        <main className="app-content">
          <Outlet context={{ darkMode, onToggleTheme }} />
        </main>
      )}
      <Footer />
    </div>
  );
}

function App() {
  const { user } = useAuth();
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
      <LoginModal />
      <RegisterModal />
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
          <Route path="xray"     element={<ReportAnalyzerPage />} />
          <Route path="history"  element={<HistoryPage />} />
          <Route path="doctors"  element={<DoctorDirectoryPage />} />
          <Route path="cost-estimator" element={<CostEstimatorPage />} />
          <Route path="medicine" element={<MedicineInfoPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="profile"  element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage darkMode={darkMode} onToggleTheme={toggleTheme} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
