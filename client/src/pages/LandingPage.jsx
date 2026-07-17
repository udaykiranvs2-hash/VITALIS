import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">VITALIS</p>
          <h1>Smart healthcare guidance for every step of your wellness journey.</h1>
          <p>Analyze symptoms, understand lab reports, compare treatment costs, and book trusted care from one modern health platform.</p>
          <div className="hero-actions">
            <Link to="/register" className="primary-button">Get Started</Link>
            <Link to="/login" className="secondary-button">Sign in</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card">
            <div className="hero-card-header">Health summary</div>
            <div className="hero-card-body">
              <p>Recent activity</p>
              <ul>
                <li>Symptom check completed</li>
                <li>Lab report analyzed</li>
                <li>Consultation due in 2 days</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <h2>Built to support your health decisions</h2>
        <div className="feature-grid">
          <article>
            <h3>Symptom assessment</h3>
            <p>Enter symptoms and receive clear next steps and specialist recommendations.</p>
          </article>
          <article>
            <h3>Report insights</h3>
            <p>Upload lab files and receive a readable summary with abnormal result highlights.</p>
          </article>
          <article>
            <h3>Doctor search</h3>
            <p>Find verified specialists by experience, location, language, and consultation fee.</p>
          </article>
          <article>
            <h3>Cost estimator</h3>
            <p>Compare procedure ranges across hospital tiers and plan ahead with confidence.</p>
          </article>
        </div>
      </section>

      <section className="section light-section">
        <div className="section-intro">
          <p className="eyebrow">How it works</p>
          <h2>Simple healthcare workflows for daily life</h2>
        </div>
        <div className="process-grid">
          <article>
            <span className="process-step">1</span>
            <h4>Create your profile</h4>
            <p>Securely store your medical preferences, conditions and contact details.</p>
          </article>
          <article>
            <span className="process-step">2</span>
            <h4>Share symptoms or reports</h4>
            <p>Use the symptom checker or upload reports to get AI-friendly explanations.</p>
          </article>
          <article>
            <span className="process-step">3</span>
            <h4>Connect to care</h4>
            <p>Book consultations with specialists and compare treatment cost estimates.</p>
          </article>
        </div>
      </section>

      <section className="section pricing-section">
        <div className="section-intro">
          <p className="eyebrow">Pricing plans</p>
          <h2>Choose the plan that fits your care journey</h2>
        </div>
        <div className="pricing-grid">
          <article>
            <h3>Starter</h3>
            <p className="price">Free</p>
            <ul>
              <li>Basic symptom checks</li>
              <li>Access to doctor directory</li>
              <li>Report summaries</li>
            </ul>
          </article>
          <article>
            <h3>Care</h3>
            <p className="price">$9.99/mo</p>
            <ul>
              <li>AI health assistant</li>
              <li>Cost estimates</li>
              <li>Priority support</li>
            </ul>
          </article>
          <article>
            <h3>Premium</h3>
            <p className="price">$19.99/mo</p>
            <ul>
              <li>Advanced report analysis</li>
              <li>Health timeline insights</li>
              <li>Doctor referral support</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section testimonials-section">
        <h2>Trusted by users who want smarter care</h2>
        <div className="testimonial-grid">
          <blockquote>
            <p>“The assistant made my report easy to understand and pointed me to the right specialist quickly.”</p>
            <cite>– Aditi, working professional</cite>
          </blockquote>
          <blockquote>
            <p>“I love the symptom checker and the emergency warnings feel reassuring.”</p>
            <cite>– Ravi, father of two</cite>
          </blockquote>
          <blockquote>
            <p>“The doctor search helped me compare fees and languages before booking a consultation.”</p>
            <cite>– Sarah, student</cite>
          </blockquote>
        </div>
      </section>

      <section className="section faq-section">
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          <details>
            <summary>Is AI Health Navigator a replacement for a doctor?</summary>
            <p>No. The platform provides educational guidance only. Always consult a licensed medical professional for diagnosis and treatment.</p>
          </details>
          <details>
            <summary>Can I upload PDF or image reports?</summary>
            <p>Yes. The report analyzer supports PDF, JPG, and PNG files with healthcare report content.</p>
          </details>
          <details>
            <summary>How secure is my data?</summary>
            <p>We protect your data with secure authentication and encrypted storage practices. Personal health information remains private.</p>
          </details>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
