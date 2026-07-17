import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
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

function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
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

  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/app" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/app" replace /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="symptoms" element={<SymptomCheckerPage />} />
          <Route path="reports" element={<ReportAnalyzerPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="doctors" element={<DoctorDirectoryPage />} />
          <Route path="cost-estimator" element={<CostEstimatorPage />} />
          <Route path="medicine" element={<MedicineInfoPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage darkMode={darkMode} onToggleTheme={() => setDarkMode((prev) => !prev)} />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
