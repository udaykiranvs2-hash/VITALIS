import { ArrowRight, ShieldCheck, Activity, FileHeart, Stethoscope, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="landing-hero-section">
      <div className="landing-hero-bg">
        <div className="landing-hero-bg-circle landing-hero-bg-circle-1" />
        <div className="landing-hero-bg-circle landing-hero-bg-circle-2" />
      </div>

      <div className="landing-hero-container">
        <div className="landing-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="landing-hero-text"
          >
            <div className="landing-hero-tag">
              <ShieldCheck size={18} />
              <span>Trusted AI Healthcare Platform</span>
            </div>

            <h1 className="landing-hero-title">
              Your Health.
              <br />
              <span>Smarter.</span>
              <br />
              Simpler.
            </h1>

            <p className="landing-hero-copy">
              AI Health Navigator helps you understand symptoms, analyze medical reports,
              estimate treatment costs, and connect with verified doctors—all from one secure platform.
            </p>

            <div className="landing-hero-cta-group">
              <button 
                type="button" 
                className="landing-hero-button landing-hero-button-primary"
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight size={18} />
              </button>
              <button 
                type="button" 
                className="landing-hero-button landing-hero-button-secondary"
                onClick={() => {
                  const elem = document.querySelector('.landing-features-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </button>
            </div>

            <div className="landing-hero-stats">
              <div className="landing-hero-stat">
                <h2>50K+</h2>
                <p>Health Reports</p>
              </div>
              <div className="landing-hero-stat">
                <h2>12K+</h2>
                <p>Doctors</p>
              </div>
              <div className="landing-hero-stat">
                <h2>98%</h2>
                <p>Satisfaction</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="landing-hero-visual"
          >
            <div className="landing-hero-card">
              <img
                src="https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg"
                alt="Doctor illustration"
                className="landing-hero-card-image"
              />
            </div>

            <div className="landing-floating-card landing-floating-card-1">
              <div className="landing-floating-card-inner">
                <div className="landing-floating-card-icon">
                  <Activity size={18} />
                </div>
                <div>
                  <h3>AI Symptom Analysis</h3>
                  <p>Risk Level: Low</p>
                </div>
              </div>
            </div>

            <div className="landing-floating-card landing-floating-card-2">
              <div className="landing-floating-card-inner">
                <div className="landing-floating-card-icon landing-floating-card-icon-green">
                  <FileHeart size={18} />
                </div>
                <div>
                  <h3>Medical Report</h3>
                  <p>Successfully Analyzed</p>
                </div>
              </div>
            </div>

            <div className="landing-floating-card landing-floating-card-3">
              <div className="landing-floating-card-inner landing-health-score-inner">
                <div>
                  <h3>Health Score</h3>
                  <p>Overall Wellness</p>
                </div>
                <div className="landing-health-score-number">92</div>
              </div>
              <div className="landing-health-score-bar">
                <div className="landing-health-score-fill" />
              </div>
            </div>

            <div className="landing-floating-card landing-floating-card-4">
              <div className="landing-floating-card-inner">
                <div className="landing-floating-card-icon landing-floating-card-icon-yellow">
                  <Star size={18} />
                </div>
                <div>
                  <h3>4.9/5 Rating</h3>
                  <p>Trusted by thousands</p>
                </div>
              </div>
            </div>

            <div className="landing-floating-card landing-floating-card-5">
              <div className="landing-floating-card-inner">
                <div className="landing-floating-card-icon landing-floating-card-icon-red">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3>24/7 Doctors</h3>
                  <p>Online Consultation</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
