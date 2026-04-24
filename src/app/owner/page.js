"use client";
import Link from 'next/link';
import { IndianRupee, ShieldCheck, Truck, BarChart3, Store } from 'lucide-react';
import styles from './owner.module.css';

export default function OwnerPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>For Store Owners & Individuals</div>
          <h1 className={styles.title}>Turn Idle Gadgets into <span className={styles.highlight}>Active Income</span>.</h1>
          <p className={styles.subtitle}>
            Don't let depreciation eat your profits. List your unsold inventory or spare devices on GadgetGo and earn weekly payouts.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/owner/signup" className={styles.primaryBtn}>
              Start Earning
            </Link>
            <Link href="#how-it-works" className={styles.secondaryBtn}>
              Learn More
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.shopMockup}>
             <Store size={80} color="var(--black)" />
             <div className={styles.earningsBadge}>+ Rs 12,500 this week</div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.iconBox}><IndianRupee size={32} /></div>
          <h3>We only take 10%</h3>
          <p>You keep 90% of the rental fee. Transparent pricing, no hidden charges. Payouts are instant upon return.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconBox}><ShieldCheck size={32} /></div>
          <h3>100% Damage Protection</h3>
          <p>Every renter leaves a refundable deposit. We also require Aadhar verification, ensuring your device is safe.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconBox}><Truck size={32} /></div>
          <h3>We handle logistics</h3>
          <p>Just pack the device. Our delivery partners pick it up from your store and deliver it directly to the renter.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconBox}><BarChart3 size={32} /></div>
          <h3>Boost Sales</h3>
          <p>Renters often end up loving the device. Upsell your rented devices directly through our platform.</p>
        </div>
      </section>

      <section id="how-it-works" className={styles.process}>
        <h2 className={styles.sectionTitle}>How to become a GadgetGo Partner</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <h3>Verify Identity</h3>
            <p>Sign up and complete your Aadhar or Business PAN verification.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <h3>List Devices</h3>
            <p>Upload photos, set your daily price, and define the damage deposit.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <h3>Accept Bookings</h3>
            <p>Get notified when a student books. Hand it over to our delivery executive.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <h3>Get Paid</h3>
            <p>Receive device back safely and get money credited directly to your bank.</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaBottom}>
        <h2>Ready to grow your business?</h2>
        <Link href="/owner/signup" className={styles.primaryBtnLarge}>Join as a Partner</Link>
      </section>
    </div>
  );
}
