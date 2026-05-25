"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck, Truck, BadgeCheck, Wallet, ArrowRight,
  ClipboardCheck, Search, PackageCheck, Banknote, AlertTriangle, Info
} from 'lucide-react';
import styles from './info.module.css';

export default function ListerInfoPage() {
  const router = useRouter();
  // State to track if lister has agreed to the policies
  const [agreed, setAgreed] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false);

  const handleNext = () => {
    if (!agreed) {
      // Show a friendly reminder instead of blocking silently
      setAttemptedNext(true);
      return;
    }
    router.push('/owner');
  };

  return (
    <div className={styles.page}>
      {/* ── Hero Header ── */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>For Retailers & Device Owners</div>
        <h1 className={styles.heroTitle}>List Your Device on Gizzmo</h1>
        <p className={styles.heroSubtitle}>
          Before you start, here's everything you need to know — how listing works,
          how returns are handled, and how you get paid. Read carefully so there are
          no surprises later. 😊
        </p>
      </div>

      <div className={styles.content}>

        {/* ── Section A: How Listing Works ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <ClipboardCheck size={28} className={styles.sectionIcon} />
            <div>
              <h2>How Listing Works</h2>
              <p>Simple 4-step process from submission to going live.</p>
            </div>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>01</div>
              <h3>Submit Your Device Online</h3>
              <p>
                Fill in device details — name, brand, MRP, rent per day, deposit,
                photos, and specs. This takes about 5 minutes.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>02</div>
              <h3>Gizzmo Team Visits & Inspects</h3>
              <p>
                Our support team will visit your shop (or you can bring the device
                to our hub) to physically verify the serial number, grade the condition,
                and take standardized photos.
              </p>
              {/* Info tip for first-time listers */}
              <div className={styles.infoTip}>
                <Info size={14} />
                This one-time visit is for your first listing. Subsequent devices
                can be verified remotely with a short video walkthrough.
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>03</div>
              <h3>Get Your Verified Badge</h3>
              <p>
                Once inspected, your listing goes live with a{' '}
                <strong>🛡️ Gizzmo Inspected</strong> badge and your profile gets a{' '}
                <strong>✅ Verified Retailer</strong> tag. This boosts renter trust
                and increases bookings.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>04</div>
              <h3>Start Receiving Bookings</h3>
              <p>
                Renters can now book your device. You'll receive a notification for
                every new booking with the renter's details and rental dates.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section B: Earnings & Commission ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Wallet size={28} className={styles.sectionIcon} />
            <div>
              <h2>Your Earnings</h2>
              <p>Transparent, fast, and fair. Here's exactly what you get.</p>
            </div>
          </div>

          <div className={styles.earningsGrid}>
            <div className={styles.earningsCard}>
              <Banknote size={32} className={styles.earningsIcon} />
              <div className={styles.earningsStat}>80%</div>
              <h3>You Keep</h3>
              <p>of every rental fee. Gizzmo takes a 20% platform commission to cover operations, support, and marketing.</p>
            </div>

            <div className={styles.earningsCard}>
              <ShieldCheck size={32} className={styles.earningsIcon} />
              <div className={styles.earningsStat}>24 hrs</div>
              <h3>Payout Speed</h3>
              <p>Your rental earnings are transferred to you within 24 hours of delivery confirmation — you don't have to wait until return.</p>
            </div>

            <div className={styles.earningsCard}>
              <BadgeCheck size={32} className={styles.earningsIcon} />
              <div className={styles.earningsStat}>100%</div>
              <h3>Damage Compensation</h3>
              <p>If a device is damaged, all compensation goes entirely to you for repair. Gizzmo takes nothing from damage claims.</p>
            </div>

            <div className={styles.earningsCard}>
              <PackageCheck size={32} className={styles.earningsIcon} />
              <div className={styles.earningsStat}>90%</div>
              <h3>Rent-to-Buy Payout</h3>
              <p>If a renter decides to buy your device permanently under Rent-to-Buy, you keep 90% of the sale value. Gizzmo takes a reduced 10% commission.</p>
            </div>
          </div>
        </section>

        {/* ── Section C: Return Process ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <PackageCheck size={28} className={styles.sectionIcon} />
            <div>
              <h2>How Returns Work</h2>
              <p>Every device return is handled through Gizzmo — no disputes, no confusion.</p>
            </div>
          </div>

          {/* Visual flow for return process */}
          <div className={styles.returnFlow}>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}><Truck size={20} /></div>
              <p><strong>Pickup</strong> — Our delivery partner collects the device from the renter's location.</p>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}><Search size={20} /></div>
              <p><strong>Inspection at Gizzmo Hub</strong> — Our team compares pre-delivery photos with current condition.</p>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}><ShieldCheck size={20} /></div>
              <p><strong>Decision Made</strong> — No damage? Deposit refunded instantly. Damage found? Repair compensation transferred to you.</p>
            </div>
            <div className={styles.flowArrow}>→</div>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}><PackageCheck size={20} /></div>
              <p><strong>Device Returned to You</strong> — Same day, along with any applicable compensation.</p>
            </div>
          </div>

          <div className={styles.infoTip} style={{ marginTop: '1.5rem' }}>
            <Info size={14} />
            After every return, both you and the renter receive an automated summary email with device condition, inspection photos, and deposit/payout details. No surprises.
          </div>
        </section>

        {/* ── Section D: What the Renter's Deposit Covers ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={28} className={styles.sectionIconWarn} />
            <div>
              <h2>Damage Protection — What You're Covered For</h2>
              <p>Gizzmo's 3-tier damage system protects you from losses.</p>
            </div>
          </div>

          <div className={styles.damageTable}>
            <div className={`${styles.damageRow} ${styles.damageMinor}`}>
              <div className={styles.damageLevel}>Minor</div>
              <div className={styles.damageDesc}>
                <strong>Surface scratches, missing accessories, cosmetic scuffs</strong>
                <p>Covered entirely by the Gizzmo Protection Pool. Renter gets full deposit back. You still get repair cost.</p>
              </div>
            </div>
            <div className={`${styles.damageRow} ${styles.damageModerate}`}>
              <div className={styles.damageLevel}>Moderate</div>
              <div className={styles.damageDesc}>
                <strong>Screen crack, keyboard issue, hinge damage, minor water exposure</strong>
                <p>Renter's deposit is partially or fully deducted. Protection pool covers any remaining gap. You receive the full repair cost.</p>
              </div>
            </div>
            <div className={`${styles.damageRow} ${styles.damageSevere}`}>
              <div className={styles.damageLevel}>Severe / Theft</div>
              <div className={styles.damageDesc}>
                <strong>Motherboard failure, total water damage, non-returned device</strong>
                <p>Full deposit retained. Protection pool contributes maximum. Renter's account suspended. Legal process initiated if required.</p>
              </div>
            </div>
          </div>

          {/* Important trust note */}
          <div className={styles.trustNote}>
            <ShieldCheck size={16} />
            <p>
              Repair amount is decided by a written quote from Gizzmo's empaneled service center — not by us or you alone.
              This keeps the process fair and transparent for everyone.
            </p>
          </div>
        </section>

        {/* ── Section E: Policy Agreement ── */}
        <section className={styles.agreementSection}>
          <h2>Before You Continue</h2>
          <p className={styles.agreementSubtext}>
            Please read our lister policies before submitting your device.
            By continuing, you confirm that you've understood the listing process,
            our commission structure, and damage handling procedures.
          </p>

          <div className={styles.policyLinks}>
            <Link href="/policies#terms" target="_blank" className={styles.policyLink}>
              📄 Terms & Conditions
            </Link>
            <Link href="/policies#damage" target="_blank" className={styles.policyLink}>
              🛡️ Damage Policy
            </Link>
            <Link href="/policies#deposit" target="_blank" className={styles.policyLink}>
              💰 Deposit & Payout Policy
            </Link>
          </div>

          {/* Checkbox consent — required to proceed */}
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setAttemptedNext(false);
              }}
              className={styles.checkbox}
            />
            <span>
              I have read and understood the listing process, Gizzmo's commission structure,
              damage handling policy, and deposit terms. I agree to list my device under these terms.
            </span>
          </label>

          {/* Friendly warning shown only if user clicks Next without agreeing */}
          {attemptedNext && !agreed && (
            <div className={styles.checkboxWarning}>
              <AlertTriangle size={16} />
              Please check the box above to confirm you've read and agree to our policies before continuing.
            </div>
          )}

          <button
            onClick={handleNext}
            className={`${styles.nextBtn} ${!agreed ? styles.nextBtnDisabled : ''}`}
          >
            Continue to List Your Device
            <ArrowRight size={20} />
          </button>

          {/* Reassurance for hesitant listers */}
          <p className={styles.reassurance}>
            🔒 Your information is safe. Listing is free. You can remove your device anytime from your profile.
          </p>
        </section>

      </div>
    </div>
  );
}
