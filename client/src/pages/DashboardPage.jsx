import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Activity, 
  FileText, 
  ScanHeart, 
  Calculator, 
  Users, 
  MessageSquare,
  HeartPulse
} from 'lucide-react';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Extract first name for personalized greeting
  const fullName = user?.profile?.fullName || user?.name || 'Kavya';
  const firstName = fullName.split(' ')[0] || fullName;

  const dashboardFeatures = [
    {
      title: 'Symptom Checker',
      description: 'Start Check',
      icon: <Activity size={32} color="#0863ce" />,
      path: '/app/symptoms'
    },
    {
      title: 'Report Analysis',
      description: 'Upload Report',
      icon: <FileText size={32} color="#0863ce" />,
      path: '/app/reports'
    },
    {
      title: 'X-ray Analysis',
      description: 'Analyze X-ray',
      icon: <ScanHeart size={32} color="#0863ce" />,
      path: '/app/xray'
    },
    {
      title: 'Cost Estimation',
      description: 'Estimate Now',
      icon: <Calculator size={32} color="#0863ce" />,
      path: '/app/cost-estimator'
    },
    {
      title: 'Doctor Connection',
      description: 'Find Doctors',
      icon: <Users size={32} color="#0863ce" />,
      path: '/app/doctors'
    },
    {
      title: 'AI Health Chat',
      description: 'Start Chat',
      icon: <MessageSquare size={32} color="#0863ce" />,
      path: '/app/assistant'
    }
  ];

  return (
    <div className="dashboard-home">
      <header className="dashboard-home-header">
        <h1>Welcome back, {firstName} <span role="img" aria-label="wave">👋</span></h1>
        <p className="dashboard-home-subtitle">How can we help you today?</p>
      </header>

      <div className="dashboard-features-grid">
        {dashboardFeatures.map((feature) => (
          <div 
            key={feature.title} 
            className="dashboard-feature-card" 
            onClick={() => navigate(feature.path)}
          >
            <div className="dashboard-feature-icon">
              {feature.icon}
            </div>
            <div className="dashboard-feature-info">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-home-footer">
        <HeartPulse size={24} color="#0863ce" />
        <span>Your Health Companion</span>
      </div>
    </div>
  );
}

export default DashboardPage;
