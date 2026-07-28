import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import '../styles/landing.css';
import { useAuth } from '../context/AuthContext.jsx';

const featureLinks = [
  { title: 'Symptom checker', description: 'Step through guided symptom collection and get clear next actions.', link: '/features/symptoms' },
  { title: 'Report analysis', description: 'Upload lab and pathology reports for concise, easy-to-understand summaries.', link: '/features/reports' },
  { title: 'X-ray analysis', description: 'Review imaging findings with AI-assisted highlights and risk indicators.', link: '/features/reports' },
  { title: 'Cost estimation', description: 'Estimate treatment and procedure pricing across care tiers.', link: '/features/cost-estimator' },
  { title: 'Doctor connection', description: 'Find and connect with verified specialists based on your needs.', link: '/features/doctors' },
  { title: 'AI health chat', description: 'Ask the assistant questions and get guided health context fast.', link: '/dev/assistant' }
];

function LandingPage() {
  const { openRegisterModal } = useAuth();
  const pricingPlans = [
    {
      name: 'Care Starter',
      price: '₹0',
      description: 'A calm place to start when you want quick guidance and reassurance.',
      features: ['3 guided symptom checks', 'Basic report summaries', 'Access to the doctor directory'],
      cta: 'Try it free',
      link: '/register'
    },
    {
      name: 'Care Companion',
      price: '₹699 / month',
      description: 'Ideal for ongoing follow-ups, recurring concerns, and better care coordination.',
      features: ['Unlimited symptom checks', 'Detailed report analysis', 'Priority doctor matching', 'Estimated treatment and consultation costs'],
      cta: 'Choose Companion',
      link: '/register',
      featured: true
    },
    {
      name: 'Care Team',
      price: '₹2,499 / month',
      description: 'Support shared care journeys with more visibility and a smoother handoff.',
      features: ['Shared accounts and family access', 'Advanced care insights', 'Dedicated support for coordination'],
      cta: 'Talk to sales',
      link: '/register'
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      <Hero />

      <section className="landing-features" id="features">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Core features</p>
          <h2 className="landing-section-title">All the tools you need for modern medical guidance</h2>
          <p className="landing-section-subtitle">Symptom evaluation, secure report review, cost comparison, doctor matching, and intelligent follow-up in one platform.</p>
        </div>
        <div className="landing-feature-grid">
          {featureLinks.map((feature) => (
            <Link key={feature.title} to={feature.link} className="feature-card landing-feature-link" aria-label={`Open ${feature.title}`}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-doctors" id="doctors">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Doctor network</p>
          <h2 className="landing-section-title">Connect with verified specialists instantly</h2>
          <p className="landing-section-subtitle">Browse expert physicians and care teams matched to your symptoms, reports, and location.</p>
        </div>
        <div className="landing-doctors-grid">
          <Link to="/features/doctors" className="feature-card landing-feature-link"><h3>Specialist matching</h3><p>Find the right doctor for imaging, lab follow-up, or primary care coordination.</p></Link>
          <Link to="/features/doctors" className="feature-card landing-feature-link"><h3>Verified credentials</h3><p>Access profile details, availability, and care focus for better trust and faster booking.</p></Link>
        </div>
      </section>

      <section className="landing-workflow" id="workflow">
        <div className="landing-workflow-copy">
          <p className="landing-section-pretitle">How it works</p>
          <h2 className="landing-section-title">A seamless workflow from concern to care</h2>
          <p className="landing-section-subtitle">Move from symptom review to report insights and doctor coordination in a clear, professional process.</p>
        </div>
        <div className="landing-workflow-grid">
          <Link to="/features/symptoms" className="workflow-card landing-feature-link"><strong>01</strong><h3>Record symptoms</h3><p>Capture your condition with guided prompts and urgency detection.</p></Link>
          <Link to="/features/reports" className="workflow-card landing-feature-link"><strong>02</strong><h3>Upload reports</h3><p>Analyze lab work, imaging, and clinical notes in one workflow.</p></Link>
          <Link to="/features/cost-estimator" className="workflow-card landing-feature-link"><strong>03</strong><h3>Review costs</h3><p>See treatment and consultation estimates before booking care.</p></Link>
          <Link to="/dev/assistant" className="workflow-card landing-feature-link"><strong>04</strong><h3>Chat with AI</h3><p>Get instant answers and prepare for your next medical visit.</p></Link>
        </div>
      </section>

      <section className="landing-about" id="about"><div className="landing-about-content"><p className="landing-section-pretitle">About Vitalis</p><h2 className="landing-section-title">Healthcare guidance designed for clarity, confidence, and care coordination.</h2><p className="landing-section-subtitle">We bring symptom checking, report analysis, imaging review, cost estimation, and doctor connection into one polished experience designed for users and care teams.</p></div></section>

      <section className="landing-contact" id="contact"><div className="landing-section-head"><p className="landing-section-pretitle">Contact</p><h2 className="landing-section-title">Ready to begin your care journey?</h2><p className="landing-section-subtitle">Reach out with questions or start your first guided symptom review today.</p></div><div className="landing-contact-card"><div><strong>Email</strong><p>support@vitalis.health</p></div><div><strong>Phone</strong><p>+1 (555) 123-4567</p></div></div></section>

      <section className="landing-pricing" id="pricing">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Pricing</p>
          <h2 className="landing-section-title">Plans that fit the way people actually seek care</h2>
          <p className="landing-section-subtitle">
            Whether you are checking a one-off concern or planning long-term follow-up, Vitalis helps you move from questions to action with less stress.
          </p>
        </div>

        <div className="pricing-grid landing-pricing-grid">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={`pricing-card${plan.featured ? ' pricing-card-featured' : ''}`}>
              {plan.featured && <span className="pricing-badge pricing-badge-featured">Most popular</span>}
              {!plan.featured && <span className="pricing-badge">{plan.name === 'Care Starter' ? 'For first-time questions' : 'For families & clinics'}</span>}
              <h3>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <p className="pricing-description">{plan.description}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button type="button" className="landing-cta-button" onClick={openRegisterModal}>{plan.cta}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta-band" id="cta"><div className="landing-cta-content"><div><p className="landing-section-pretitle">Ready to simplify care?</p><h2>Start your first symptom review and medical report analysis in minutes.</h2></div><div style={{ display: 'flex', gap: '0.75rem' }}><Link to="/features/cost-estimator" className="landing-cta-button" style={{ background: '#fff', color: '#0f172a' }}>Estimate cost</Link><button type="button" className="landing-cta-button" onClick={openRegisterModal}>Start for free</button></div></div></section>
    </div>
  );
}

export default LandingPage;
