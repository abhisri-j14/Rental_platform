import React from 'react';
import styles from './howwework.module.css';

export const metadata = {
  title: 'How We Work | Gizzmo',
  description: 'Understand the Gizzmo business model, how rentals work, how damage is handled, and how both renters and retailers benefit.',
};

export default function HowWeWorkPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroBadge}>Transparent by Design</div>
        <h1>How Gizzmo Works</h1>
        <p>
          A fair, transparent rental marketplace for students, young professionals,
          and device retailers. Here is exactly how the platform operates — no hidden surprises.
        </p>
      </header>

      <div className={styles.content}>

        {/* ── Section 1: The Money Split ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>01</span>
            <h2>The Money Split</h2>
          </div>
          <p className={styles.sectionDesc}>
            Gizzmo runs on a marketplace model. Every rupee you pay is split transparently.
          </p>

          <div className={styles.splitGrid}>
            <div className={styles.splitCard}>
              <div className={styles.splitPercent}>80%</div>
              <h3>Goes to the Retailer</h3>
              <p>The device owner keeps 80% of the rental fee for making their gear available. Paid within 24 hours of delivery confirmation.</p>
            </div>
            <div className={styles.splitCard}>
              <div className={styles.splitPercent} style={{ color: '#f59e0b' }}>20%</div>
              <h3>Goes to Gizzmo</h3>
              <p>This covers platform operations, 24/7 support, delivery coordination, device inspections, and marketing — everything that makes the ecosystem work.</p>
            </div>
          </div>

          {/* Clear note about non-refundable fees */}
          <div className={styles.infoNote}>
            💡 <strong>Good to know:</strong> The Protection Fee and Delivery Fee are separate from the rental split. The Protection Fee goes into the Gizzmo Protection Pool (used for damage compensation — not platform profit). Delivery fees cover logistics.
          </div>
        </section>

        {/* ── Section 2: What You Pay at Checkout ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>02</span>
            <h2>What You Pay at Checkout</h2>
          </div>
          <p className={styles.sectionDesc}>
            Your checkout total is made up of 4 components. Here's what each one means.
          </p>

          <div className={styles.payTable}>
            <div className={styles.payRow}>
              <div className={styles.payItem}>
                <strong>Rental Fee</strong>
                <span>Device usage charge for the number of days you rent. Duration discounts are applied automatically.</span>
              </div>
              <div className={styles.payBadge} style={{ background: '#ede9fe', color: '#6d28d9' }}>Variable</div>
            </div>
            <div className={styles.payRow}>
              <div className={styles.payItem}>
                <strong>Protection Fee</strong>
                <span>Small, mandatory, non-refundable fee (₹59–₹299 based on device MRP). Goes into a shared damage pool — not platform profit.</span>
              </div>
              <div className={styles.payBadge} style={{ background: '#fef3c7', color: '#92400e' }}>Non-refundable</div>
            </div>
            <div className={styles.payRow}>
              <div className={styles.payItem}>
                <strong>Refundable Deposit</strong>
                <span>Flat amount (₹499–₹2,499 depending on device value). Held during rental, returned within 2 hours of a clean inspection.</span>
              </div>
              <div className={styles.payBadge} style={{ background: '#d1fae5', color: '#065f46' }}>Fully Refundable</div>
            </div>
            <div className={styles.payRow}>
              <div className={styles.payItem}>
                <strong>Delivery Fee</strong>
                <span>₹20 for orders under ₹500 · ₹12 for ₹500–₹1,500 · FREE for orders above ₹1,500.</span>
              </div>
              <div className={styles.payBadge} style={{ background: '#dbeafe', color: '#1d4ed8' }}>Dynamic</div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Duration Discounts ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>03</span>
            <h2>Rent Longer, Pay Less</h2>
          </div>
          <p className={styles.sectionDesc}>
            Duration discounts are applied <strong>automatically</strong> at checkout — you don't need to enter any code.
            The longer you rent, the more you save.
          </p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rental Duration</th>
                <th>Discount</th>
                <th>You Pay</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1 – 2 Days</td><td>No discount</td><td>100% of base rent</td></tr>
              <tr><td>3 – 6 Days</td><td style={{ color: '#16a34a', fontWeight: 700 }}>10% off</td><td>90% of base rent</td></tr>
              <tr><td>7 – 29 Days</td><td style={{ color: '#16a34a', fontWeight: 700 }}>25% off</td><td>75% of base rent</td></tr>
              <tr><td>30+ Days</td><td style={{ color: '#16a34a', fontWeight: 700 }}>50% off</td><td>50% of base rent</td></tr>
            </tbody>
          </table>
          <p className={styles.tableNote}>
            The discount applies to the base rent only. Protection fee, deposit, and delivery fee remain unchanged.
          </p>
        </section>

        {/* ── Section 4: The Protection Pool ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>04</span>
            <h2>The Gizzmo Protection Pool</h2>
          </div>
          <p className={styles.sectionDesc}>
            The protection fee is not profit — it's a shared safety net for all renters and retailers.
          </p>

          <div className={styles.poolFlow}>
            <div className={styles.poolStep}>
              <div className={styles.poolIcon}>📲</div>
              <p>Every renter pays a small protection fee (₹59–₹299) when checking out.</p>
            </div>
            <div className={styles.poolArrow}>→</div>
            <div className={styles.poolStep}>
              <div className={styles.poolIcon}>🏦</div>
              <p>Fees from all rentals build a shared Protection Pool managed by Gizzmo.</p>
            </div>
            <div className={styles.poolArrow}>→</div>
            <div className={styles.poolStep}>
              <div className={styles.poolIcon}>🔧</div>
              <p>If a device is damaged, the pool contributes to the retailer's repair cost — alongside the renter's deposit.</p>
            </div>
            <div className={styles.poolArrow}>→</div>
            <div className={styles.poolStep}>
              <div className={styles.poolIcon}>✅</div>
              <p>100% of pool payouts go to the retailer. Gizzmo earns nothing from damage claims.</p>
            </div>
          </div>
        </section>

        {/* ── Section 5: Damage Handling ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>05</span>
            <h2>How Damage is Handled</h2>
          </div>
          <p className={styles.sectionDesc}>
            All return inspections happen at the Gizzmo Hub — not at your doorstep. This makes the
            process neutral, verifiable, and dispute-free.
          </p>

          <div className={styles.damageGrid}>
            <div className={`${styles.damageCard} ${styles.minor}`}>
              <div className={styles.damageLabel}>Minor</div>
              <div className={styles.damageDetail}>
                <strong>Repair cost under ₹800</strong>
                <p>Scratches, missing accessories, cosmetic scuffs</p>
                <p className={styles.outcome}>✅ Full deposit refunded to renter. Pool covers repair. Retailer gets repair cost.</p>
              </div>
            </div>
            <div className={`${styles.damageCard} ${styles.moderate}`}>
              <div className={styles.damageLabel}>Moderate</div>
              <div className={styles.damageDetail}>
                <strong>Repair cost ₹800–₹3,500</strong>
                <p>Screen crack, keyboard issue, hinge damage</p>
                <p className={styles.outcome}>⚠️ Deposit partially/fully deducted. Pool supplements gap. Retailer gets full repair cost.</p>
              </div>
            </div>
            <div className={`${styles.damageCard} ${styles.severe}`}>
              <div className={styles.damageLabel}>Severe / Theft</div>
              <div className={styles.damageDetail}>
                <strong>Above ₹3,500 or non-return</strong>
                <p>Motherboard failure, total damage, theft</p>
                <p className={styles.outcome}>❌ Full deposit retained. Pool max contribution. Account suspended. Legal action if required.</p>
              </div>
            </div>
          </div>

          <div className={styles.infoNote}>
            🔍 <strong>Who decides the damage amount?</strong> An empaneled service center (Gizzmo's repair partners) provides a written quote. That quote is the final deduction amount — not our estimate, not the retailer's guess.
          </div>
        </section>

        {/* ── Section 6: Return Process ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>06</span>
            <h2>The Return Process</h2>
          </div>
          <p className={styles.sectionDesc}>
            Every device return goes through the Gizzmo Hub. This protects both the renter and retailer.
          </p>

          <ol className={styles.returnList}>
            <li>
              <strong>You schedule a return</strong> from your order tracking page.
            </li>
            <li>
              <strong>Our delivery partner picks up the device</strong> from your location.
            </li>
            <li>
              <strong>Device arrives at Gizzmo Hub</strong> for inspection — pre-delivery photos are compared with current condition.
            </li>
            <li>
              <strong>No damage found?</strong> Device goes back to retailer. Your deposit is refunded within 2 hours.
            </li>
            <li>
              <strong>Damage found?</strong> Severity assessed, repair quote obtained, deduction decided. Device + compensation sent to retailer same day.
            </li>
            <li>
              <strong>You and the retailer both receive an automated email</strong> with the full inspection report, deposit status, and payout details.
            </li>
          </ol>
        </section>

        {/* ── Section 7: Trust & Safety ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>07</span>
            <h2>Trust & Safety</h2>
          </div>
          <p className={styles.sectionDesc}>
            Zero anonymity. Every user and retailer is verified before any transaction.
          </p>

          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🪪</span>
              <div>
                <strong>KYC Verification</strong>
                <p>All renters and retailers complete Aadhaar-based verification. No anonymous rentals — ever.</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>📦</span>
              <div>
                <strong>Delivery OTP</strong>
                <p>Device handover is confirmed with a one-time passcode — no disputed deliveries.</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🛡️</span>
              <div>
                <strong>Gizzmo Inspected Badge</strong>
                <p>Every listed device is physically inspected by our team before going live. Condition is graded and photos taken.</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>⭐</span>
              <div>
                <strong>Rating System</strong>
                <p>Post-rental ratings for both renters and retailers build a reputation economy that rewards good behavior.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
