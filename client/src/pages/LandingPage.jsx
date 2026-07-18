import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import '../styles/landing.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />

      <section className="landing-features" id="features">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Core features</p>
          <h2 className="landing-section-title">All the tools you need for modern medical guidance</h2>
          <p className="landing-section-subtitle">
            Symptom evaluation, secure report review, cost comparison, doctor matching, and intelligent follow-up in one platform.
          </p>
        </div>

        <div className="landing-feature-grid">
          <article className="feature-card">
            <h3>Symptom checker</h3>
            <p>Step through guided symptom collection and get clear next actions.</p>
          </article>
          <article className="feature-card">
            <h3>Report analysis</h3>
            <p>Upload lab and pathology reports for concise, easy-to-understand summaries.</p>
          </article>
          <article className="feature-card">
            <h3>X-ray analysis</h3>
            <p>Review imaging findings with AI-assisted highlights and risk indicators.</p>
          </article>
          <article className="feature-card">
            <h3>Cost estimation</h3>
            <p>Estimate treatment and procedure pricing across care tiers.</p>
          </article>
          <article className="feature-card">
            <h3>Doctor connection</h3>
            <p>Find and connect with verified specialists based on your needs.</p>
          </article>
          <article className="feature-card">
            <h3>AI health chat</h3>
            <p>Ask the assistant questions and get guided health context fast.</p>
          </article>
        </div>
      </section>

      <section className="landing-doctors" id="doctors">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Doctor network</p>
          <h2 className="landing-section-title">Connect with verified specialists instantly</h2>
          <p className="landing-section-subtitle">
            Browse expert physicians and care teams matched to your symptoms, reports, and location.
          </p>
        </div>

        <div className="landing-doctors-grid">
          <article className="feature-card">
            <h3>Specialist matching</h3>
            <p>Find the right doctor for imaging, lab follow-up, or primary care coordination.</p>
          </article>
          <article className="feature-card">
            <h3>Verified credentials</h3>
            <p>Access profile details, availability, and care focus for better trust and faster booking.</p>
          </article>
        </div>
      </section>

      <section className="landing-workflow" id="workflow">
        <div className="landing-workflow-copy">
          <p className="landing-section-pretitle">How it works</p>
          <h2 className="landing-section-title">A seamless workflow from concern to care</h2>
          <p className="landing-section-subtitle">
            Move from symptom review to report insights and doctor coordination in a clear, professional process.
          </p>
        </div>

        <div className="landing-workflow-grid">
          <article className="workflow-card">
            <strong>01</strong>
            <h3>Record symptoms</h3>
            <p>Capture your condition with guided prompts and urgency detection.</p>
          </article>
          <article className="workflow-card">
            <strong>02</strong>
            <h3>Upload reports</h3>
            <p>Analyze lab work, imaging, and clinical notes in one workflow.</p>
          </article>
          <article className="workflow-card">
            <strong>03</strong>
            <h3>Review costs</h3>
            <p>See treatment and consultation estimates before booking care.</p>
          </article>
          <article className="workflow-card">
            <strong>04</strong>
            <h3>Chat with AI</h3>
            <p>Get instant answers and prepare for your next medical visit.</p>
          </article>
        </div>
      </section>

      <section className="landing-about" id="about">
        <div className="landing-about-content">
          <p className="landing-section-pretitle">About Vitalis</p>
          <h2 className="landing-section-title">Healthcare guidance designed for clarity, confidence, and care coordination.</h2>
          <p className="landing-section-subtitle">
            We bring symptom checking, report analysis, imaging review, cost estimation, and doctor connection into one polished experience designed for users and care teams.
          </p>
        </div>
      </section>

      <section className="landing-contact" id="contact">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Contact</p>
          <h2 className="landing-section-title">Ready to begin your care journey?</h2>
          <p className="landing-section-subtitle">
            Reach out with questions or start your first guided symptom review today.
          </p>
        </div>
        <div className="landing-contact-card">
          <div>
            <strong>Email</strong>
            <p>support@vitalis.health</p>
          </div>
          <div>
            <strong>Phone</strong>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </section>

      <section className="landing-pricing" id="pricing">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Pricing</p>
          <h2 className="landing-section-title">Simple plans for individuals and care teams</h2>
          <p className="landing-section-subtitle">Choose a plan that fits your needs — start free and upgrade as you scale.</p>
        </div>

        <div className="pricing-grid">
          <article>
            <h3>Free</h3>
            <p className="price">₹0</p>
            <ul>
              <li>Basic symptom checks</li>
              <li>Report summaries (limited)</li>
              <li>Access to doctor directory</li>
            </ul>
            <Link to="/register" className="landing-cta-button">Start free</Link>
          </article>

          <article>
            <h3>Plus</h3>
            <p className="price">₹699 / mo</p>
            <ul>
              <li>Unlimited symptom checks</li>
              <li>Full report analysis</li>
              <li>Priority doctor matches</li>
            </ul>
            <Link to="/register" className="landing-cta-button">Get Plus</Link>
          </article>

          <article>
            <h3>Pro</h3>
            <p className="price">₹2,499 / mo</p>
            <ul>
              <li>Team accounts & sharing</li>
              <li>Advanced analytics</li>
              <li>Dedicated support</li>
            </ul>
            <Link to="/register" className="landing-cta-button">Get Pro</Link>
          </article>
        </div>
      </section>

      <section className="landing-cta-band" id="cta">
        <div className="landing-cta-content">
          <div>
            <p className="landing-section-pretitle">Ready to simplify care?</p>
            <h2>Start your first symptom review and medical report analysis in minutes.</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/cost-estimator" className="landing-cta-button" style={{ background: '#fff', color: '#0f172a' }}>
              Estimate cost
            </Link>
            <Link to="/register" className="landing-cta-button">
              Start for free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
