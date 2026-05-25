"use client";
import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Lock, FileText, EyeOff, ShieldCheck, HardDriveDownload } from 'lucide-react';
import styles from './policies.module.css';

const TABS = [
  { id: 'damage',     label: 'Damage Policy',       icon: AlertTriangle },
  { id: 'deposit',    label: 'Deposit Policy',       icon: Lock },
  { id: 'protection', label: 'Protection Fee',       icon: Shield },
  { id: 'terms',      label: 'Terms & Conditions',   icon: FileText },
  { id: 'theft',      label: 'Theft & Fraud',        icon: EyeOff },
  { id: 'privacy',    label: 'Privacy Policy',       icon: ShieldCheck },
  { id: 'datasafe',   label: '🔒 Data Safe Protocol', icon: HardDriveDownload },
];

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState('damage');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && TABS.find(t => t.id === hash)) setActiveTab(hash);
  }, []);

  const handleTabChange = (id) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className={styles.hubContainer}>

      {/* ── Hero Header ── */}
      <header className={styles.hubHeader}>
        <div>
          <h1>Our Policies</h1>
          <p>Transparent, fair, and written in plain English. Click any tab to read in full.</p>
        </div>
      </header>

      {/* ── Tab Bar ── */}
      <div className={styles.tabBar}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className={styles.tabContent}>

        {/* ────────── DAMAGE POLICY ────────── */}
        {activeTab === 'damage' && (
          <div className={styles.policyBody}>
            <h2><AlertTriangle size={28} /> Damage Policy</h2>

            <p className={styles.intro}>
              Gizzmo uses a <strong>3-tier damage system</strong> to handle disputes fairly.
              All damage decisions are made by the Gizzmo Support Team — not by the renter or retailer alone.
              Every assessment uses pre-delivery and post-return photo evidence.
            </p>

            <div className={styles.highlight}>
              <strong>📋 Damage Assessment Policy</strong>
              The Gizzmo Support Team performs the final damage assessment within 48 hours of device return,
              using pre-delivery and post-return photos, inspection reports, and retailer evidence.
              The repair cost is decided by a written quote from our empaneled service center — not an estimate.
            </div>

            <h3>Damage Severity Levels</h3>

            <div className={styles.damageGrid}>
              <div className={`${styles.damageCard} ${styles.minor}`}>
                <div className={styles.damageTag}>Tier 1 — Minor</div>
                <p className={styles.damageThreshold}>Repair cost under ₹800</p>
                <p><strong>Examples:</strong> Surface scratches, missing rubber feet, cosmetic scuffs, minor cable fray</p>
                <p className={styles.damageAction}>
                  ✅ Full deposit refunded to renter<br />
                  ✅ Protection Pool covers repair cost<br />
                  ✅ Retailer receives compensation
                </p>
              </div>

              <div className={`${styles.damageCard} ${styles.moderate}`}>
                <div className={styles.damageTag}>Tier 2 — Moderate</div>
                <p className={styles.damageThreshold}>Repair cost ₹800 – ₹3,500</p>
                <p><strong>Examples:</strong> Screen crack (budget phones), keyboard broken, hinge damage, minor water exposure</p>
                <p className={styles.damageAction}>
                  ⚠️ Deposit partially/fully deducted<br />
                  ✅ Pool supplements any gap<br />
                  ✅ Retailer gets full repair cost<br />
                  ✅ Remaining deposit refunded
                </p>
              </div>

              <div className={`${styles.damageCard} ${styles.severe}`}>
                <div className={styles.damageTag}>Tier 3 — Severe / Theft</div>
                <p className={styles.damageThreshold}>Above ₹3,500 or non-return</p>
                <p><strong>Examples:</strong> MacBook screen crack, motherboard failure, water damage, device not returned</p>
                <p className={styles.damageAction}>
                  ❌ Full deposit retained<br />
                  ✅ Pool contributes maximum amount<br />
                  ❌ Account suspended<br />
                  ⚖️ Legal action initiated for theft
                </p>
              </div>
            </div>

            <div className={styles.note}>
              <strong>💡 If you dispute the damage decision:</strong>
              You can request a second quote from another empaneled repair partner.
              The <strong>lower of the two quotes</strong> becomes the final deduction. Always fair to the renter.
            </div>
          </div>
        )}

        {/* ────────── DEPOSIT POLICY ────────── */}
        {activeTab === 'deposit' && (
          <div className={styles.policyBody}>
            <h2><Lock size={28} /> Deposit Policy</h2>

            <p className={styles.intro}>
              A refundable deposit is collected at checkout. If the device comes back undamaged,
              <strong> every rupee is returned within 2 hours</strong> of inspection — no delays, no hidden deductions.
            </p>

            <div>
              <h3>Deposit Amounts by Device MRP</h3>
              <table className={styles.table}>
                <thead>
                  <tr><th>Device MRP (Original Price)</th><th>Flat Deposit</th></tr>
                </thead>
                <tbody>
                  <tr><td>Below ₹25,000</td><td><strong>₹499</strong></td></tr>
                  <tr><td>₹25,000 – ₹49,999</td><td><strong>₹799</strong></td></tr>
                  <tr><td>₹50,000 – ₹89,999</td><td><strong>₹1,199</strong></td></tr>
                  <tr><td>₹90,000 – ₹1,49,999</td><td><strong>₹1,799</strong></td></tr>
                  <tr><td>₹1,50,000 and above</td><td><strong>₹2,499</strong></td></tr>
                </tbody>
              </table>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.75rem' }}>
                We use flat amounts — not percentages. This keeps deposits affordable for students.
              </p>
            </div>

            <div>
              <h3>Refund Timeline</h3>
              <ul className={styles.policyList}>
                <li><strong>No damage:</strong> Full deposit refunded within 2 hours of inspection passing.</li>
                <li><strong>Minor damage (under ₹800):</strong> Full deposit back. Protection Pool covers repair.</li>
                <li><strong>Moderate damage:</strong> Repair cost deducted. Remainder refunded within 2 hours.</li>
                <li><strong>Severe damage / Theft:</strong> Deposit fully retained. No refund.</li>
              </ul>

              <div className={styles.note} style={{ marginTop: '1rem' }}>
                <strong>📧 You'll receive an email</strong> after every return inspection with the exact deduction,
                photo evidence (if any), and refund status — fully transparent, no guessing.
              </div>
            </div>
          </div>
        )}

        {/* ────────── PROTECTION FEE ────────── */}
        {activeTab === 'protection' && (
          <div className={styles.policyBody}>
            <h2><Shield size={28} /> Protection Fee</h2>

            <p className={styles.intro}>
              A small, mandatory, non-refundable fee collected at checkout. All fees go into the
              <strong> Gizzmo Protection Pool</strong> — a shared fund used exclusively to compensate
              retailers for device damage. Gizzmo does <strong>not</strong> profit from this fee.
            </p>

            <div>
              <h3>Fee by Device MRP</h3>
              <table className={styles.table}>
                <thead>
                  <tr><th>Device MRP</th><th>Protection Fee</th></tr>
                </thead>
                <tbody>
                  <tr><td>Below ₹25,000</td><td><strong>₹59</strong></td></tr>
                  <tr><td>₹25,000 – ₹49,999</td><td><strong>₹99</strong></td></tr>
                  <tr><td>₹50,000 – ₹89,999</td><td><strong>₹129</strong></td></tr>
                  <tr><td>₹90,000 – ₹1,49,999</td><td><strong>₹199</strong></td></tr>
                  <tr><td>₹1,50,000 and above</td><td><strong>₹299</strong></td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3>How the Pool Works</h3>
              <ul className={styles.policyList}>
                <li>Fees from all rentals are pooled together — micro-insurance model.</li>
                <li>Most devices return undamaged — those fees build the pool.</li>
                <li>When damage occurs, the pool contributes to the repair cost.</li>
                <li><strong>100% of pool payouts go to the retailer.</strong> Gizzmo earns nothing from damage claims.</li>
              </ul>

              <div className={styles.note} style={{ marginTop: '1rem' }}>
                <strong>Why non-refundable?</strong> Once a device is handed to a renter, the platform has
                incurred inspection, delivery, and support costs — regardless of whether damage occurs.
                Think of it like travel insurance: you pay whether you need it or not.
              </div>
            </div>
          </div>
        )}

        {/* ────────── TERMS & CONDITIONS ────────── */}
        {activeTab === 'terms' && (
          <div className={styles.policyBody}>
            <h2><FileText size={28} /> Terms & Conditions</h2>

            <p className={styles.intro}>
              By using Gizzmo — as a renter or a lister — you agree to the following terms.
              These exist to keep the platform safe and fair for everyone.
            </p>

            <div>
              <h3>For Renters</h3>
              <ul className={styles.policyList}>
                <li>Aadhaar-based KYC verification is mandatory before renting any device.</li>
                <li>You are responsible for the device from OTP delivery confirmation until Gizzmo Hub inspection.</li>
                <li>Do not repair, modify, or tamper with the device during rental.</li>
                <li>Return all accessories provided at delivery.</li>
                <li>False KYC or damage reporting → permanent suspension and legal action.</li>
                <li><strong>Data responsibility:</strong> Sign out of all personal accounts (Google, social media, banking apps) before returning the device.</li>
                <li><strong>Password safety:</strong> Do not save banking passwords or payment credentials on rented devices.</li>
                <li>Gizzmo is not liable for personal data left voluntarily on a device after return.</li>
              </ul>
            </div>

            <div>
              <h3>For Retailers / Listers</h3>
              <ul className={styles.policyList}>
                <li>All devices must be genuine, functional, and lawfully owned by you.</li>
                <li>Physical inspection by Gizzmo team is required before listing goes live.</li>
                <li>Serial number, MRP, and condition must be accurately disclosed.</li>
                <li>Damage claims must be filed within 24 hours with supporting photo evidence.</li>
                <li>Fraudulent or inflated claims → account suspension.</li>
                <li><strong>Rent-to-Buy Conversion:</strong> For rentals of 7+ days, renters have the option to buy the device permanently. Renters receive a 5% loyalty discount off the MRP, and listers receive 90% of the final sale price (Gizzmo retains a reduced 10% sales commission instead of the standard 20% rental fee).</li>
              </ul>
            </div>

            <div className={styles.note} style={{ gridColumn: '1 / -1' }}>
              <strong>Platform Rights:</strong> Gizzmo reserves the right to remove listings not meeting quality standards,
              deduct 20% commission automatically before rental payouts (reduced to 10% for Rent-to-Buy purchases), and update these terms with 7 days' notice to active users.
            </div>
          </div>
        )}

        {/* ────────── THEFT & FRAUD ────────── */}
        {activeTab === 'theft' && (
          <div className={styles.policyBody}>
            <h2><EyeOff size={28} /> Theft & Fraud Policy</h2>

            <p className={styles.intro}>
              We take fraud and theft seriously. This policy protects retailers from dishonest renters,
              and renters from fraudulent damage claims by retailers.
            </p>

            <div>
              <h3>If a Device is Not Returned</h3>
              <ul className={styles.policyList}>
                <li>Full deposit immediately retained.</li>
                <li>Protection Pool contributes maximum available amount to retailer.</li>
                <li>FIR filed using verified KYC details.</li>
                <li>Account permanently suspended and blacklisted.</li>
                <li>Civil and criminal proceedings at Gizzmo's discretion.</li>
              </ul>
            </div>

            <div>
              <h3>Fraudulent Retailer Claims</h3>
              <ul className={styles.policyList}>
                <li>Claims must be filed within 24 hours with photo/video evidence.</li>
                <li>No claim filed within 24 hours → deposit auto-refunded to renter.</li>
                <li>Inflated or fabricated claims → retailer account suspended.</li>
                <li>All claims cross-verified against pre-delivery inspection photos.</li>
              </ul>
            </div>

            <div className={styles.note} style={{ gridColumn: '1 / -1' }}>
              <strong>Our Zero-Tolerance Stance:</strong> Gizzmo acts as a neutral judge — neither side can
              manipulate outcomes. Both renters and retailers are equally protected by this policy.
            </div>
          </div>
        )}

        {/* ────────── PRIVACY POLICY ────────── */}
        {activeTab === 'privacy' && (
          <div className={styles.policyBody}>
            <h2><ShieldCheck size={28} /> Privacy Policy</h2>

            <p className={styles.intro}>
              We collect only what we need. Your data powers the platform — never sold,
              never shared without your consent.
            </p>

            <div>
              <h3>What We Collect</h3>
              <ul className={styles.policyList}>
                <li><strong>Account data:</strong> Name, email, phone number</li>
                <li><strong>KYC data:</strong> Aadhaar number (stored encrypted)</li>
                <li><strong>Order data:</strong> Rental history, delivery addresses, payment confirmations</li>
                <li><strong>Device data:</strong> Inspection photos, serial numbers (for listed devices)</li>
              </ul>
            </div>

            <div>
              <h3>Your Rights</h3>
              <ul className={styles.policyList}>
                <li>Request deletion of your account and personal data anytime via support.</li>
                <li>KYC data is stored encrypted — only accessed during dispute resolution.</li>
                <li>We do not sell your data to third parties. Ever.</li>
                <li>Inspection photos retained for 1 year after rental end for dispute purposes.</li>
              </ul>

              <div className={styles.note} style={{ marginTop: '1rem' }}>
                For privacy concerns or data deletion, email <strong>support@gizzmo.in</strong>.
                We respond within 48 hours.
              </div>
            </div>
          </div>
        )}

        {/* ────────── DATA SAFE PROTOCOL ────────── */}
        {activeTab === 'datasafe' && (
          <div className={styles.policyBody}>
            <h2><HardDriveDownload size={28} /> Data Safe Protocol</h2>

            <p className={styles.intro}>
              Gizzmo is the <strong>only electronics rental platform in India</strong> with a mandatory
              Data Safe protocol. Every device is fully wiped and securely reset between rentals — protecting
              both the previous user's data and the incoming renter's privacy.
            </p>

            <div className={styles.highlight}>
              <strong>🔒 Your data, always safe.</strong>
              Before every rental, devices are fully factory reset and secure wiped by our verified retailers.
              We recommend signing out of all accounts before returning. For extra peace of mind, avoid saving
              sensitive passwords on rented devices.
            </div>

            <h3>Mandatory Retailer Checklist (Before Every New Rental)</h3>

            <div className={styles.dataSafeGrid}>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeNum}>01</div>
                <div>
                  <strong>Windows Reset (Fresh Start)</strong>
                  <p>Removes all user files and resets to factory state. Built-in to Windows — costs ₹0.</p>
                </div>
              </div>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeNum}>02</div>
                <div>
                  <strong>BIOS Password Clear</strong>
                  <p>Removes any previous user-set lock so the new renter gets a clean, unblocked device.</p>
                </div>
              </div>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeNum}>03</div>
                <div>
                  <strong>Secure Erase (Eraser App)</strong>
                  <p>Overwrites deleted files so they cannot be recovered by any data recovery tool. Free software.</p>
                </div>
              </div>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeNum}>04</div>
                <div>
                  <strong>New Windows User Account</strong>
                  <p>Clean slate for the new renter — no traces of previous accounts, files, or browsing history.</p>
                </div>
              </div>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeNum}>05</div>
                <div>
                  <strong>Physical Wipe</strong>
                  <p>Keyboard, ports, and screen cleaned for hygiene and professionalism before every handover.</p>
                </div>
              </div>
            </div>

            <h3>Camera & SD Card Protocol</h3>

            <ul className={styles.policyList}>
              <li>For camera rentals, the retailer must <strong>remove the SD card</strong> before every rental, OR format it completely.</li>
              <li>Renters are encouraged to use <strong>their own SD card</strong> for maximum privacy.</li>
              <li>This is a <strong>mandatory listing requirement</strong> for all camera listings on Gizzmo.</li>
              <li>Retailers who do not comply with the SD card protocol may be delisted.</li>
            </ul>

            <h3>Renter's Responsibilities</h3>

            <ul className={styles.policyList}>
              <li>Sign out of all personal accounts (Google, Instagram, banking apps) before returning any device.</li>
              <li>Do not save banking passwords or UPI PINs on rented devices.</li>
              <li>Gizzmo is not liable for data left voluntarily on a device after return.</li>
              <li>Report any data concern immediately to <strong>support@gizzmo.in</strong> — we investigate within 24 hours.</li>
            </ul>

            <div className={styles.note} style={{ gridColumn: '1 / -1' }}>
              <strong>🏅 Data Safe Badge:</strong> Every listing where the retailer has agreed to and completed the full
              wipe protocol displays a <strong>"Data Safe"</strong> badge — just like Zomato's Hygiene Rated badge.
              Gizzmo reserves the right to delist any retailer with a verified data complaint.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
