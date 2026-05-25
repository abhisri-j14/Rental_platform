"use client";
import { useState } from 'react';
import { Building2, Laptop, ShieldAlert, Award, Headphones, ArrowRight, Check } from 'lucide-react';
import styles from './corporate.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CorporatePage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    packageType: 'starter',
    teamSize: 5,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/corporate/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          company: '',
          phone: '',
          email: '',
          packageType: 'starter',
          teamSize: 5,
          notes: ''
        });
      } else {
        setError(data.error || 'Failed to submit request');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>GIZZMO FOR BUSINESS</span>
          <h1>Equip Your Tech Team <br /><span className={styles.gradientText}>Zero Capital Expenditure</span></h1>
          <p>Flexible tech rentals for startups and growing enterprises. Instantly scale workstation counts, testing devices, and remote setups without heavy asset costs.</p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <h3>0</h3>
              <p>Upfront Capital</p>
            </div>
            <div className={styles.stat}>
              <h3>2hr</h3>
              <p>SLA Callback</p>
            </div>
            <div className={styles.stat}>
              <h3>100%</h3>
              <p>Tax Deductible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <h2>Why Businesses Rent on Gizzmo</h2>
        <div className={styles.benefitGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}><Laptop size={24} /></div>
            <h3>Always Up-to-Date Tech</h3>
            <p>Upgrade teams to newer hardware variants every 12 months. Say goodbye to depreciation losses.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}><Award size={24} /></div>
            <h3>Gizzmo Data Safe & Insured</h3>
            <p>Full liability insurance covers manufacturing faults. Hard drives are sanitized to military grades between uses.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}><Headphones size={24} /></div>
            <h3>Same-Day Replacements</h3>
            <p>Hardware issues? Get replacement hardware delivered to your office within 4 hours, free of charge.</p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className={styles.packages}>
        <h2>Corporate Setup Packages</h2>
        <div className={styles.packageGrid}>
          <div className={styles.packageCard}>
            <span className={styles.packTag}>Starter</span>
            <h3>Bootstrap setup</h3>
            <p className={styles.packDesc}>Perfect for small founding squads (1-10 members).</p>
            <ul className={styles.packFeatures}>
              <li><Check size={16} /> Standard Developer Laptops</li>
              <li><Check size={16} /> 24" External Monitors</li>
              <li><Check size={16} /> Flexible Monthly Rolling Terms</li>
              <li><Check size={16} /> Next-Day Delivery & Setup</li>
            </ul>
          </div>
          <div className={styles.packageCard} data-popular="true">
            <span className={styles.packTagPopular}>Growth</span>
            <h3>Scaling Workspace</h3>
            <p className={styles.packDesc}>Best for growth teams (11-50 members).</p>
            <ul className={styles.packFeatures}>
              <li><Check size={16} /> High-End workstations (M3 Macs)</li>
              <li><Check size={16} /> iOS/Android Mobile Test Device Pool</li>
              <li><Check size={16} /> Capped Liability Insurance</li>
              <li><Check size={16} /> 12hr Replacement SLA</li>
            </ul>
          </div>
          <div className={styles.packageCard}>
            <span className={styles.packTag}>Scale</span>
            <h3>Enterprise Suite</h3>
            <p className={styles.packDesc}>For large operations (50+ members).</p>
            <ul className={styles.packFeatures}>
              <li><Check size={16} /> Custom Device Imaging & MDM</li>
              <li><Check size={16} /> Dedicated Account Manager</li>
              <li><Check size={16} /> 4hr SLA Response</li>
              <li><Check size={16} /> Customized Invoice Cycles</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Request Callback Section */}
      <section className={styles.callbackSection}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Building2 size={36} color="#00D99F" />
            <h2>Schedule a Business Consultation</h2>
            <p>We will construct a customized hardware plan for your team and call you within 2 hours.</p>
          </div>

          {success ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}><Check size={40} /></div>
              <h3>Consultation Requested!</h3>
              <p>Your B2B package inquiry has been logged. A Gizzmo Business consultant will contact you via email or phone shortly.</p>
              <button onClick={() => setSuccess(false)} className={styles.successResetBtn}>Submit Another Request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.errorBox}>{error}</div>}
              
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Priyanshu Sharma" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="company">Company Name</label>
                  <input type="text" id="company" name="company" required value={formData.company} onChange={handleChange} placeholder="e.g. Acme Tech Pvt Ltd" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Work Email</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="e.g. sharma@acme.com" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Contact Number</label>
                  <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="packageType">Preferred Package</label>
                  <select id="packageType" name="packageType" value={formData.packageType} onChange={handleChange}>
                    <option value="starter">Starter Setup (1-10 members)</option>
                    <option value="growth">Growth Setup (11-50 members)</option>
                    <option value="scale">Enterprise Scale (50+ members)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="teamSize">Team Size Needed</label>
                  <input type="number" id="teamSize" name="teamSize" min="1" required value={formData.teamSize} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.inputGroupFull}>
                <label htmlFor="notes">Tell us about your team's hardware requirements</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g. We need 15 MacBooks, 10 test iPads, and 15 mechanical keyboards." rows="4"></textarea>
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'SENDING INQUIRY...' : 'REQUEST B2B CALLBACK'} <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
