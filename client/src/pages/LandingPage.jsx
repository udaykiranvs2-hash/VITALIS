import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import '../styles/landing.css';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Stethoscope, FileHeart, ScanLine, Calculator, Users, MessageCircle,
  ArrowRight, CheckCircle2, ShieldCheck, Lock, HeartPulse, X, Sparkles,
  Clock, BadgeCheck, LifeBuoy, ChevronDown, ChevronUp, Bot
} from 'lucide-react';

const featureLinks = [
  { title: 'Symptom checker', description: 'Step through guided symptom collection and get clear next actions.', link: '/app/symptoms' },
  { title: 'Report analysis', description: 'Upload lab and pathology reports for concise, easy-to-understand summaries.', link: '/app/reports' },
  { title: 'X-ray analysis', description: 'Review imaging findings with AI-assisted highlights and risk indicators.', link: '/app/xray' },
  { title: 'Cost estimation', description: 'Estimate treatment and procedure pricing across care tiers.', link: '/app/cost-estimator' },
  { title: 'Doctor connection', description: 'Find and connect with verified specialists based on your needs.', link: '/app/doctors' },
  { title: 'AI health chat', description: 'Ask the assistant questions and get guided health context fast.', link: '/app/assistant' }
];

/* ============================================================
   LEARN MORE MODAL  (kept exactly as the user liked it)
   ============================================================ */
const featureTagStyles = {
  blue:   { bg: 'rgba(37, 99, 235, 0.12)', fg: '#1d4ed8' },
  green:  { bg: 'rgba(16, 185, 129, 0.14)', fg: '#047857' },
  purple: { bg: 'rgba(139, 92, 246, 0.14)', fg: '#6d28d9' },
  amber:  { bg: 'rgba(245, 158, 11, 0.16)', fg: '#b45309' },
  teal:   { bg: 'rgba(20, 184, 166, 0.14)', fg: '#0f766e' },
  pink:   { bg: 'rgba(236, 72, 153, 0.14)', fg: '#be185d' }
};

const learnMoreFeatures = [
  { key: 'symptom', title: 'Smart Symptom Checker', tag: 'Start here', tagColor: 'blue', description: 'Walk through a friendly, step-by-step interview. Tell us your age, symptoms, duration, and lifestyle — VITALIS highlights possible causes, urgency level, and exactly what to do next.', icon: <Stethoscope size={22} /> },
  { key: 'report',  title: 'Medical Report Analysis', tag: 'Most used', tagColor: 'green', description: 'Upload any lab report, pathology result, or discharge summary. VITALIS reads it instantly and explains values in plain language, flags out-of-range results, and suggests what to ask your doctor.', icon: <FileHeart size={22} /> },
  { key: 'xray',    title: 'AI X-Ray Analysis', tag: 'Advanced', tagColor: 'purple', description: 'Upload a chest X-ray and our AI overlays possible findings, healthy vs. concerning regions, and gives you a readability confidence score. Perfect for getting a fast second-look before the radiologist report.', icon: <ScanLine size={22} /> },
  { key: 'cost',    title: 'Treatment Cost Estimator', tag: 'Save money', tagColor: 'amber', description: 'Planning a procedure? Enter country, city, hospital tier, and treatment name. VITALIS returns a realistic cost range with breakdowns so you can compare options before booking.', icon: <Calculator size={22} /> },
  { key: 'doctor',  title: 'Verified Doctor Connection', tag: 'Care network', tagColor: 'teal', description: 'Find the right specialist for your needs based on symptoms, location, availability, and verified credentials. See reviews, next available slot, and book with one click.', icon: <Users size={22} /> },
  { key: 'ai',      title: '24/7 AI Health Chat', tag: 'Always on', tagColor: 'pink', description: 'A friendly AI assistant that answers your everyday health questions in seconds. Fever tips, BP ranges, meal plans, sleep advice, how to read reports — all in natural conversation.', icon: <MessageCircle size={22} /> }
];

function LearnMoreModal({ open, onClose, getStarted }) {
  const [faqOpen, setFaqOpen] = useState(0);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => firstFocusRef.current?.focus(), 80);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const faqs = [
    {
      q: 'Is VITALIS a replacement for my doctor?',
      a: 'No. VITALIS is an informational AI platform designed to help you understand your body and get care faster. It does not diagnose, prescribe, or replace a licensed physician. Always consult a doctor for medical decisions.'
    },
    {
      q: 'Is my health data private and secure?',
      a: 'Yes. VITALIS uses end-to-end encrypted connections, never shares your data with third parties, and auto-deletes uploads you mark as temporary. All files are stored in ISO 27001 compliant infrastructure behind strict role-based access controls.'
    },
    {
      q: 'Do I need insurance or a prescription to use it?',
      a: 'No. You can start using VITALIS for free simply by creating an account. No insurance card, referral, or prescription required.'
    },
    {
      q: 'Which countries and languages are supported?',
      a: 'VITALIS is globally accessible. Cost estimation currently covers 40+ countries and 4 currencies. The UI is in English, but the AI chat replies comfortably in Hindi, Spanish, French, and 20+ other languages.'
    },
    {
      q: 'What is included in the free tier?',
      a: 'Care Starter (free forever) gives you 3 symptom checks / month, basic report summaries, doctor directory access, and 30 AI chat turns / day. Upgrade to Care Companion for unlimited everything plus priority doctor matching.'
    },
    {
      q: 'How accurate is the AI?',
      a: 'We validate every release against a curated corpus of Qbank medical questions and peer-reviewed literature. The AI is tuned to favor caution (under-diagnose) rather than overconfidence, and clearly states when it is uncertain.'
    }
  ];

  return (
    <div
      className="learn-more-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className={`learn-more-dialog ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="learn-more-title"
      >
        <button
          type="button"
          className="learn-more-close"
          onClick={onClose}
          aria-label="Close learn more"
          ref={firstFocusRef}
        >
          <X size={18} />
        </button>

        <header className="learn-more-header">
          <div className="learn-more-header-badge">
            <HeartPulse size={16} />
            About VITALIS
          </div>
          <h2 id="learn-more-title">A calmer way to navigate everyday health.</h2>
          <p>
            VITALIS brings AI-powered symptom understanding, medical report clarity, cost transparency,
            and verified doctor connections onto a single, secure platform. It's the friendly assistant
            you wish you had before every doctor visit.
          </p>
        </header>

        <section className="learn-more-grid">
          {[
            { icon: <Clock size={20} />, title: 'Answers in minutes', text: 'Get a clear picture of your symptoms and next steps in under 5 minutes.' },
            { icon: <BadgeCheck size={20} />, title: 'Evidence-based', text: 'Every AI answer is grounded in current medical guidelines and peer-reviewed sources.' },
            { icon: <Lock size={20} />, title: 'Private by design', text: 'Your data never trains public models. You control what stays and what is deleted.' },
            { icon: <LifeBuoy size={20} />, title: 'Human backup', text: 'Stuck on something? Connect with a verified human doctor in a few taps.' }
          ].map((it) => (
            <div className="learn-more-cell" key={it.title}>
              <div className="learn-more-cell-icon">{it.icon}</div>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </section>

        <section className="learn-more-section">
          <div className="learn-more-section-head">
            <p className="landing-section-pretitle" style={{margin: 0}}>What you can do</p>
            <h3>Six powerful tools, one calm experience.</h3>
          </div>
          <div className="learn-more-feature-list">
            {learnMoreFeatures.map((f) => (
              <div key={f.key} className="learn-more-feature-row">
                <div
                  className="learn-more-feature-icon"
                  style={{ background: featureTagStyles[f.tagColor].bg, color: featureTagStyles[f.tagColor].fg }}
                >
                  {f.icon}
                </div>
                <div className="learn-more-feature-copy">
                  <h4>{f.title}</h4>
                  <p>{f.description}</p>
                </div>
                <span className="learn-more-feature-tag" style={{ background: featureTagStyles[f.tagColor].bg, color: featureTagStyles[f.tagColor].fg }}>
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="learn-more-section">
          <div className="learn-more-section-head">
            <p className="landing-section-pretitle" style={{margin: 0}}>How it works</p>
            <h3>From concern → clarity → care in 4 simple steps.</h3>
          </div>
          <ol className="learn-more-steps">
            {[
              { t: 'Sign up in 30 seconds', d: 'Just your name, email, and password — no paperwork, no insurance needed.' },
              { t: 'Share what you feel', d: 'Describe symptoms, upload a report, ask the AI chat, or estimate a procedure cost.' },
              { t: 'Understand the output', d: 'See severity, flagged values, likely next tests, and plain-language summaries.' },
              { t: 'Take confident next action', d: 'Book a verified doctor appointment, save a PDF summary, or follow home-care guidance.' }
            ].map((s, i) => (
              <li key={s.t}>
                <strong>0{i + 1}</strong>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="learn-more-section learn-more-safety">
          <div className="learn-more-safety-grid">
            <div>
              <p className="landing-section-pretitle" style={{margin: 0, color: '#059669'}}>Safety first</p>
              <h3>Safety and privacy are not add-ons.</h3>
              <p>
                VITALIS AI answers carry a visible disclaimer that they are informational and not medical advice.
                High-risk prompts are automatically routed to an "urgent care" panel with red-flag warnings and
                emergency contact suggestions.
              </p>
              <ul className="learn-more-check-list">
                <li><CheckCircle2 size={18} /> Red-flags "chest pain / breathlessness" → directs to ER</li>
                <li><CheckCircle2 size={18} /> Never stores passwords; uses salted hashes only</li>
                <li><CheckCircle2 size={18} /> Files encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li><CheckCircle2 size={18} /> Delete all your data from Settings, one click</li>
              </ul>
            </div>
            <div className="learn-more-safety-card">
              <div className="learn-more-safety-card-icon">
                <ShieldCheck size={22} />
              </div>
              <h4>Built with medical guardrails</h4>
              <p>Every VITALIS AI response is routed through a safety layer that filters inappropriate requests, avoids definitive diagnoses, and suggests in-person consultation when needed.</p>
              <div className="learn-more-safety-foot">
                <Bot size={16} />
                <span>Powered by VITALIS Safety v2.0</span>
              </div>
            </div>
          </div>
        </section>

        <section className="learn-more-section">
          <div className="learn-more-section-head">
            <p className="landing-section-pretitle" style={{margin: 0}}>FAQ</p>
            <h3>Answers to common questions.</h3>
          </div>
          <div className="learn-more-faq-list">
            {faqs.map((f, i) => {
              const isOpen = faqOpen === i;
              return (
                <button
                  type="button"
                  key={f.q}
                  className={`learn-more-faq-item ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setFaqOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <div className="learn-more-faq-q">
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  {isOpen && (
                    <div className="learn-more-faq-a">
                      <p>{f.a}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <footer className="learn-more-footer">
          <div>
            <h3>Ready to try VITALIS?</h3>
            <p>Start free, no credit card required. You&apos;ll be inside in under a minute.</p>
          </div>
          <button type="button" className="landing-cta-button learn-more-cta-btn" onClick={getStarted}>
            Get Started Free
            <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ============================================================
   LANDING PAGE  (simple original layout restored)
   ============================================================ */
function LandingPage() {
  const { user, openLoginModal, openRegisterModal } = useAuth();
  const navigate = useNavigate();
  const [learnOpen, setLearnOpen] = useState(false);
  const [startedRipple, setStartedRipple] = useState(null);

  const handleFeatureClick = (e, link) => {
    e.preventDefault();
    if (user) {
      navigate(link);
    } else {
      openLoginModal();
    }
  };

  const doGetStarted = (e) => {
    if (e?.currentTarget && typeof window !== 'undefined') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;
      const id = Date.now();
      setStartedRipple({ id, x, y });
      setTimeout(() => setStartedRipple((r) => (r && r.id === id ? null : r)), 650);
    }
    openRegisterModal();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pricingPlans = [
    {
      name: 'Care Starter',
      price: '₹0',
      description: 'A calm place to start when you want quick guidance and reassurance.',
      features: ['3 guided symptom checks', 'Basic report summaries', 'Access to the doctor directory'],
      cta: 'Try it free',
      badge: 'For first-time questions',
      featured: false,
      link: '/register'
    },
    {
      name: 'Care Companion',
      price: '₹699 / month',
      description: 'Ideal for ongoing follow-ups, recurring concerns, and better care coordination.',
      features: ['Unlimited symptom checks', 'Detailed report analysis', 'Priority doctor matching', 'Estimated treatment and consultation costs'],
      cta: 'Choose Companion',
      badge: 'Most popular',
      featured: true,
      link: '/register'
    },
    {
      name: 'Care Team',
      price: '₹2,499 / month',
      description: 'Support shared care journeys with more visibility and a smoother handoff.',
      features: ['Shared accounts and family access', 'Advanced care insights', 'Dedicated support for coordination'],
      cta: 'Talk to sales',
      badge: 'For families & clinics',
      featured: false,
      link: '/register'
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      <Hero
        onLearnMore={() => setLearnOpen(true)}
        onGetStarted={doGetStarted}
      />

      <section className="landing-features" id="features">
        <div className="landing-section-head">
          <p className="landing-section-pretitle">Core features</p>
          <h2 className="landing-section-title">All the tools you need for modern medical guidance</h2>
          <p className="landing-section-subtitle">Symptom evaluation, secure report review, cost comparison, doctor matching, and intelligent follow-up in one platform.</p>
        </div>
        <div className="landing-feature-grid">
          {featureLinks.map((feature) => (
            <a key={feature.title} href={feature.link} onClick={(e) => handleFeatureClick(e, feature.link)} className="feature-card landing-feature-link" aria-label={`Open ${feature.title}`}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </a>
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
          <a href="/app/doctors" onClick={(e) => handleFeatureClick(e, '/app/doctors')} className="feature-card landing-feature-link"><h3>Specialist matching</h3><p>Find the right doctor for imaging, lab follow-up, or primary care coordination.</p></a>
          <a href="/app/doctors" onClick={(e) => handleFeatureClick(e, '/app/doctors')} className="feature-card landing-feature-link"><h3>Verified credentials</h3><p>Access profile details, availability, and care focus for better trust and faster booking.</p></a>
        </div>
      </section>

      <section className="landing-workflow" id="workflow">
        <div className="landing-workflow-copy">
          <p className="landing-section-pretitle">How it works</p>
          <h2 className="landing-section-title">A seamless workflow from concern to care</h2>
          <p className="landing-section-subtitle">Move from symptom review to report insights and doctor coordination in a clear, professional process.</p>
        </div>
        <div className="landing-workflow-grid">
          <a href="/app/symptoms" onClick={(e) => handleFeatureClick(e, '/app/symptoms')} className="workflow-card landing-feature-link"><strong>01</strong><h3>Record symptoms</h3><p>Capture your condition with guided prompts and urgency detection.</p></a>
          <a href="/app/reports" onClick={(e) => handleFeatureClick(e, '/app/reports')} className="workflow-card landing-feature-link"><strong>02</strong><h3>Upload reports</h3><p>Analyze lab work, imaging, and clinical notes in one workflow.</p></a>
          <a href="/app/cost-estimator" onClick={(e) => handleFeatureClick(e, '/app/cost-estimator')} className="workflow-card landing-feature-link"><strong>03</strong><h3>Review costs</h3><p>See treatment and consultation estimates before booking care.</p></a>
          <a href="/app/assistant" onClick={(e) => handleFeatureClick(e, '/app/assistant')} className="workflow-card landing-feature-link"><strong>04</strong><h3>Chat with AI</h3><p>Get instant answers and prepare for your next medical visit.</p></a>
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
              <span className={`pricing-badge${plan.featured ? ' pricing-badge-featured' : ''}`}>{plan.badge}</span>
              <h3>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <p className="pricing-description">{plan.description}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button type="button" className="landing-cta-button" onClick={(e) => doGetStarted(e)}>
                {startedRipple && (
                  <span
                    key={startedRipple.id}
                    className="ripple-effect"
                    style={{ left: startedRipple.x, top: startedRipple.y }}
                  />
                )}
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta-band" id="cta"><div className="landing-cta-content"><div><p className="landing-section-pretitle">Ready to simplify care?</p><h2>Start your first symptom review and medical report analysis in minutes.</h2></div><div style={{ display: 'flex', gap: '0.75rem' }}><a href="/app/cost-estimator" onClick={(e) => handleFeatureClick(e, '/app/cost-estimator')} className="landing-cta-button" style={{ background: '#fff', color: '#0f172a', textDecoration: 'none' }}>Estimate cost</a><button type="button" className="landing-cta-button" onClick={(e) => doGetStarted(e)}>Start for free</button></div></div></section>

      <LearnMoreModal
        open={learnOpen}
        onClose={() => setLearnOpen(false)}
        getStarted={(e) => {
          setLearnOpen(false);
          setTimeout(() => doGetStarted(e), 150);
        }}
      />
    </div>
  );
}

export default LandingPage;
